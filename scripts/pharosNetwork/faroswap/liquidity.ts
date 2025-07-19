import { Contract, formatUnits, JsonRpcProvider, parseUnits, Wallet } from "ethers"
import { tokenBalance } from "@scripts/utils/balance"
import { approve } from "@scripts/utils/approve"
import { liquidityABI } from "@scripts/lib/data"
import ERC29ABI from "@scripts/lib/ERC20.json"

interface LiquidityParams {
  poolAddress: string,
  tokenIn: string,
  tokenOut: string,
  deadline: number,
  signer: Wallet,
  amountIn_inPercent: number,
  provider: JsonRpcProvider,
}
// Router contract address and ABI
const routerAddress = "0x4b177aded3b8bd1d5d747f91b9e853513838cd49"
const spender = "0x73CAfc894dBfC181398264934f7Be4e482fc9d40"

export async function createLiquidity({
  poolAddress,
  tokenIn,
  tokenOut,
  deadline,
  signer,
  amountIn_inPercent,
  provider,
}:LiquidityParams) {
  const pool = new Contract(poolAddress, liquidityABI, signer)
  const [baseToken, quoteToken, baseRes, quoteRes] = await pool.getPMMState()
  if(baseRes > quoteRes){
      [tokenIn, tokenOut] = [tokenOut, tokenIn]
  }

  const {balance: balanceTokenIn, symbol: symbolTokenIn, decimals: decimalsTokenIn} = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: tokenIn 
  })
  const {symbol: symbolTokenOut, decimals: decimalsTokenOut} = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: tokenOut
  })
  let amountIn = balanceTokenIn * BigInt(amountIn_inPercent) / 100n  

  try {
    const price = Number(quoteRes) / Number(baseRes)
    const slippage = 0.0015
    const floatOut = price * (Number(amountIn) / Math.pow(10, Number(decimalsTokenOut)))
    const minOut = parseUnits(truncateDecimals(floatOut, Number(decimalsTokenOut)), Number(decimalsTokenOut))

    await approve({
      tokenAddress: tokenIn,
      ERC20ABI: ERC29ABI,
      signer,
      router: spender,
      amount: amountIn
    })
    await approve({
      tokenAddress: tokenOut,
      ERC20ABI: ERC29ABI,
      signer,
      router: spender,
      amount: minOut
    })
    
    const id = BigInt(deadline)
    console.log(`Suplying ${symbolTokenIn}/${symbolTokenOut} to ${poolAddress}`)
    const router = new Contract(routerAddress, liquidityABI, signer)
    
    const nonce = await signer.getNonce()
    const baseMinAmount = BigInt(Math.floor(Number(amountIn) * (1 - slippage)));   // 999_001
    const quoteMinAmount = BigInt(Math.floor(Number(minOut) * (1 - slippage))); // 999_000

    console.log(`amountIn: ${formatUnits(amountIn, decimalsTokenIn)}, minOut: ${formatUnits(minOut, decimalsTokenOut)}, baseMinAmount: ${formatUnits(baseMinAmount, decimalsTokenIn)}, quoteMinAmount: ${formatUnits(quoteMinAmount, decimalsTokenOut)}`)

    const tx = await router.addDVMLiquidity(
      poolAddress,
      amountIn,
      minOut,
      baseMinAmount,
      quoteMinAmount,
      0n,
      id, 
      {nonce}
    )
    await tx.wait()
    console.log(`Success! txhash: ${tx.hash}`)
  } catch (error) {
    console.error(error)
  }
}

function truncateDecimals(num: number, decimals: number) {
  return Number(num.toFixed(decimals)).toString()
}