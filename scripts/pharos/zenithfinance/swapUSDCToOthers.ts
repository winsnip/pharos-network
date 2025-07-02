import "dotenv/config"
import { ethers } from "hardhat"
import poolAddresses from "./poolAddress.json"
import tokenAddresses from "./tokenAddress.json"
import { getPrice } from "../../utils/price"
import ERC20ABI from "../../abi/ERC20.json"
import { multicallSwap } from "./multicallSwap"
import { getTokenBalance } from "../../utils/amount"
import { sleep } from "../../utils/time"


const { 
     ROUTER_SWAP_ZENITH = "",
     AMOUNT_IN_PERCENT = "",
     SET_TIMEOUT = ""
} = process.env
const amount = Number(AMOUNT_IN_PERCENT)
const timeout = Number(SET_TIMEOUT)

export async function swapUSDC(){
     const [signer] = await ethers.getSigners()
     const poolAddressUsdcToUsdt = poolAddresses.filter(item => item.pair === "USDC/USDT")[0].address
     const usdcAddress = tokenAddresses.filter(item => item.name === "USDC")[0].address
     const usdtAddress = tokenAddresses.filter(item => item.name === "USDT")[0].address

     const priceUsdcToUsdt = await getPrice({
          poolAddress: poolAddressUsdcToUsdt,
          addresses: {
               "tokenA": usdcAddress,
               "tokenB": usdtAddress
          }
     })
     let {balance: usdcBalance, decimals: usdcDecimals} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI)
     let {balance: usdtBalance, decimals: usdtDecimals} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI)
     const slippageTolerance = 0.01
     let amountIn = Number(ethers.formatUnits(usdcBalance, usdcDecimals)) * amount / 100 // % from balance
     let amountOut = (amountIn * priceUsdcToUsdt.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP USDC/USDT")
     console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: usdcAddress,
               tokenOutAddress: usdtAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(2).toString(), usdcDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(2).toString(), usdtDecimals),
               fee: Number(priceUsdcToUsdt.fee)
          });
          await sleep(timeout);
          ({balance: usdcBalance} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI));
          ({balance: usdtBalance} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI));
          console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}`)
     } catch (error) {
          console.error(error)
     }

     const poolAddressUsdcToWphrs = poolAddresses.filter(item => item.pair === "USDC/PHRS")[0].address
     const wphrsAddress = tokenAddresses.filter(item => item.name === "WPHRS")[0].address

     const priceUsdcToWphrs = await getPrice({
          poolAddress: poolAddressUsdcToWphrs,
          addresses: {
               "tokenA": usdcAddress,
               "tokenB": wphrsAddress
          }
     })
     let {balance: wphrsBalance, decimals: wphrsDecimals} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI)
     amountIn = Number(ethers.formatUnits(usdcBalance, usdcDecimals)) * amount / 100 // % from balance
     amountOut = (amountIn * priceUsdcToWphrs.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP USDC/WPHRS")
     console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: usdcAddress,
               tokenOutAddress: wphrsAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(2).toString(), usdcDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(7).toString(), wphrsDecimals),
               fee: Number(priceUsdcToWphrs.fee)
          });
          await sleep(timeout);
          ({balance: usdcBalance} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI));
          ({balance: wphrsBalance} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI));
          console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     } catch (error) {
          console.error(error)
     }
}