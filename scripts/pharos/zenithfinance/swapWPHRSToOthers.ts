import "dotenv/config"
import { ethers } from "hardhat"
import poolAddresses from "./poolAddress.json"
import tokenAddresses from "./tokenAddress.json"
import { getPrice } from "../../utils/price"
import ERC20ABI from "../../abi/ERC20.json"
import { multicallSwap } from "./multicallSwap"
import { getTokenBalance } from "../../utils/amount"
import { sleep } from "../../utils/time"
import { getCoinBalance } from "../../utils/amount"


const { 
     ROUTER_SWAP_ZENITH = "",
     AMOUNT_IN_PERCENT = "",
     SET_TIMEOUT = ""
} = process.env
const amount = Number(AMOUNT_IN_PERCENT)
const timeout = Number(SET_TIMEOUT)

export async function swapWphrs(){
     const [signer] = await ethers.getSigners()
     const phrsBalance = await getCoinBalance(signer.address)
     try {
          console.log(`PHRS Balance: ${phrsBalance}`)
          const wrapPhrsAmount = Number(phrsBalance) * amount / 100 // % from balance PHRS
          console.log("Wrap PHRS to WPHRS")
          console.log("Wrapping...")
          await depositWphrs(wrapPhrsAmount)
     } catch (error) {
          console.error(error)
     }
     const poolAddressWphrsToUsdc = poolAddresses.filter(item => item.pair === "USDC/PHRS")[0].address
     const usdcAddress = tokenAddresses.filter(item => item.name === "USDC")[0].address
     const wphrsAddress = tokenAddresses.filter(item => item.name === "WPHRS")[0].address

     const priceWphrsToUsdc = await getPrice({
          poolAddress: poolAddressWphrsToUsdc,
          addresses: {
               "tokenA": wphrsAddress,
               "tokenB": usdcAddress
          }
     })
     let {balance: usdcBalance, decimals: usdcDecimals} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI)
     let {balance: wphrsBalance, decimals: wphrsDecimals} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI)
     const slippageTolerance = 0.05
     let amountIn = Number(ethers.formatUnits(wphrsBalance, wphrsDecimals)) * amount / 100 // % from balance
     let amountOut = (amountIn * priceWphrsToUsdc.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP WPHRS/USDC")
     console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: wphrsAddress,
               tokenOutAddress: usdcAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(7).toString(), wphrsDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(5).toString(), usdcDecimals),
               fee: Number(priceWphrsToUsdc.fee)
          });
          await sleep(timeout);
          ({balance: usdcBalance} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI));
          ({balance: wphrsBalance} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI));
          console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     } catch (error) {
          console.error(error)
     }

     const poolAddressWphrsToUsdt = poolAddresses.filter(item => item.pair === "USDT/PHRS")[0].address
     const usdtAddress = tokenAddresses.filter(item => item.name === "USDT")[0].address

     const priceWphrsToUsdt = await getPrice({
          poolAddress: poolAddressWphrsToUsdt,
          addresses: {
               "tokenA": wphrsAddress,
               "tokenB": usdtAddress
          }
     })
     let {balance: usdtBalance, decimals: usdtDecimals} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI)
     amountIn = Number(ethers.formatUnits(wphrsBalance, wphrsDecimals)) * amount / 100 // % from balance
     amountOut = (amountIn * priceWphrsToUsdt.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP WPHRS/USDT")
     console.log(`usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: wphrsAddress,
               tokenOutAddress: usdtAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(7).toString(), wphrsDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(5).toString(), usdtDecimals),
               fee: Number(priceWphrsToUsdt.fee)
          });
          await sleep(timeout);
          ({balance: usdtBalance} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI));
          ({balance: wphrsBalance} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI));
          console.log(`usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     } catch (error) {
          console.error(error)
     }
}

export async function depositWphrs(amount: number) {
    const [signer] = await ethers.getSigners()
    const contracAddress = "0x76aaada469d23216be5f7c596fa25f282ff9b364"
    const erc20Abi = [
        "function deposit() payable"
    ]
    const nonce = await signer.getNonce()
    try {
        const contract = new ethers.Contract(contracAddress, erc20Abi, signer)
        const tx = await contract.deposit({value: ethers.parseEther(amount.toString()), nonce: nonce})
        await tx.wait()
        console.log(`hash: ${tx.hash}`)
    } catch (error) {
        console.error(error)
    }
}