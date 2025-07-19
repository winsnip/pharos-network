import { Contract, formatUnits, JsonRpcProvider, parseUnits, Wallet } from "ethers"
import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { tokenBalance } from "@scripts/utils/balance"
import { approve } from "@scripts/utils/approve"
import ERC29ABI from "@scripts/lib/ERC20.json"
import * as dotenv from "dotenv"
import path from "path"


const headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.5",
        "Origin": "https://faroswap.xyz",
        "Referer": "https://faroswap.xyz/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Sec-Ch-Ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Brave\";v=\"138\"",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "\"macOS\"",
        "Sec-GPC": "1"
  }
  
interface SwapParams {
  tokenIn: string,
  tokenOut: string,
  deadline: number,
  signer: Wallet,
  amountIn_inPercent: number,
  provider: JsonRpcProvider,
  dirname: string,
  slippageUrl: string
}
// Router contract address and ABI
const routerAddress = "0x3541423f25a1ca5c98fdbcf478405d3f0aad1164"
const routerAbi = [
  "function mixSwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minOut, uint256 expectedOut, address[] dexes, address[] path, address[] adapters, uint256 fee, bytes[] data, bytes permit, uint256 id)"
]


export async function swap({
  tokenIn,
  tokenOut,
  deadline,
  signer,
  amountIn_inPercent,
  provider,
  dirname,
  slippageUrl,
}:SwapParams) {
  dotenv.config({path: path.join(dirname, ".env")})
  const { PROXY_URL = "" } = process.env!
  const {balance: balanceTokenIn, symbol: symbolTokenIn, decimals: decimalsTokenIn} = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: tokenIn 
  })
  const {symbol: symbolTokenOut} = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: tokenOut
  })
  let amountIn = balanceTokenIn * BigInt(amountIn_inPercent) / 100n
  if(tokenIn == "0xD4071393f8716661958F766DF660033b3d35fD29"){
    amountIn = 1000000n
  }

  const urlSpenderAddress = `https://api.dodoex.io/route-service/v2/widget/getdodoroute?chainId=688688&deadLine=${deadline}&apikey=a37546505892e1a952&slippage=${slippageUrl}&source=dodoV2AndMixWasm&toTokenAddress=${tokenOut}&fromTokenAddress=${tokenIn}&userAddr=${signer.address}&estimateGas=false&fromAmount=${amountIn}`
  

  try {
    const getSpenderAddress = await fetchWithProxyUndici({
      url: urlSpenderAddress,
      proxyUrl: PROXY_URL,
      method: "GET",
      headers
    })
    const spender = JSON.parse(getSpenderAddress.body)
    await approve({
      tokenAddress: tokenIn,
      ERC20ABI: ERC29ABI,
      signer,
      router: spender.data.targetApproveAddr,
      amount: amountIn
    })
    
    deadline = Math.floor(Date.now() / 1000) + 60 * 20
    const url = `https://api.dodoex.io/route-service/v2/widget/getdodoroute?chainId=688688&deadLine=${deadline}&apikey=a37546505892e1a952&slippage=${slippageUrl}&source=dodoV2AndMixWasm&toTokenAddress=${tokenOut}&fromTokenAddress=${tokenIn}&userAddr=${signer.address}&estimateGas=true&fromAmount=${amountIn}`
    const res = await fetchWithProxyUndici({
      url: url,
      proxyUrl: PROXY_URL,
      method: "GET",
      headers
    })
    const response = JSON.parse(res.body)
    const resAmount = response.data.resAmount
    const decimals = response.data.targetDecimals
    
    const slippage = 0.5
    const safeAmount = applySlippage(resAmount, slippage)

    const expectedOut = parseUnits(truncateDecimals(safeAmount,decimals), decimals)
    const minOut = parseUnits(formatUnits(BigInt(response.data.minReturnAmount),decimals), decimals)
    console.log(`expectedOut: ${formatUnits(expectedOut, decimals)}, minOut: ${formatUnits(minOut, decimals)}, amountIn: ${formatUnits(amountIn, decimalsTokenIn)}`)
    const dexes: string[] = []
    const path: string[] = []
    const adapters: string[] = []
    const data: string[] = []
    const fee: bigint = 2n
    const dataDefault = "0x000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000002710"
    const dexesDefault = "0x133dc434daaa4fDaB19f7599AB552D6Ac350c810"

    if(response.data.routePlan.length > 1){
      path.push(
        response.data.routePlan[0].pool, 
        response.data.routePlan[1].pool
      )
      adapters.push(
        response.data.routePlan[0].pool, 
        response.data.routePlan[1].pool,
        routerAddress
      )
      data.push(
        dataDefault,
        dataDefault
      )
      dexes.push(
        dexesDefault,
        dexesDefault
      )
    }else{
      path.push(response.data.routePlan[0].pool)
      adapters.push(
        response.data.routePlan[0].pool,
        routerAddress
      )
      data.push(dataDefault)
      dexes.push(dexesDefault)
    }
    const permit = "0x" + "00".repeat(64)
    const id = BigInt(deadline)
    console.log(`Swapping ${symbolTokenIn}/${symbolTokenOut}`)
    const router = new Contract(routerAddress, routerAbi, signer)
    const nonce = await signer.getNonce()
    if(expectedOut > minOut){
      const tx = await router.mixSwap(
        tokenIn,
        tokenOut,
        amountIn,
        minOut,
        expectedOut,
        dexes,
        path,
        adapters,
        fee,
        data,
        permit,
        id
      , {
        nonce
      })
      await tx.wait()
      console.log(`Success! txhash: ${tx.hash}`)
    }else{
      console.log("ExpectedOut less than minOut")
    }
  } catch (error) {
    console.error(error)
  }
}

function truncateDecimals(num: number, decimals: number) {
  return Number(num.toFixed(decimals)).toString()
}

function applySlippage(amount: number, slippagePercent: number): number {
  return amount * (1 - slippagePercent / 100);
}
