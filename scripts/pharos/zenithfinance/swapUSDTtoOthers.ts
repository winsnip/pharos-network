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

export async function swapUSDT(){
     const [signer] = await ethers.getSigners()
     const poolAddressUsdtToUsdc = poolAddresses.filter(item => item.pair === "USDC/USDT")[0].address
     const usdcAddress = tokenAddresses.filter(item => item.name === "USDC")[0].address
     const usdtAddress = tokenAddresses.filter(item => item.name === "USDT")[0].address

     const priceUsdtToUsdc = await getPrice({
          poolAddress: poolAddressUsdtToUsdc,
          addresses: {
               "tokenA": usdtAddress,
               "tokenB": usdcAddress
          }
     })
     let {balance: usdcBalance, decimals: usdcDecimals} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI)
     let {balance: usdtBalance, decimals: usdtDecimals} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI)
     const slippageTolerance = 0.01
     let amountIn = Number(ethers.formatUnits(usdtBalance, usdtDecimals)) * amount / 100 // % from balance
     let amountOut = (amountIn * priceUsdtToUsdc.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP USDT/USDC")
     console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: usdtAddress,
               tokenOutAddress: usdcAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(2).toString(), usdtDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(2).toString(), usdcDecimals),
               fee: Number(priceUsdtToUsdc.fee)
          });
          await sleep(timeout);
          ({balance: usdcBalance} = await getTokenBalance(signer.address, usdcAddress, ERC20ABI));
          ({balance: usdtBalance} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI));
          console.log(`usdcBalance: ${ethers.formatUnits(usdcBalance, usdcDecimals)}, usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}`)
     } catch (error) {
          console.error(error)
     }

     const poolAddressUsdtToWphrs = poolAddresses.filter(item => item.pair === "USDT/PHRS")[0].address
     const wphrsAddress = tokenAddresses.filter(item => item.name === "WPHRS")[0].address

     const priceUsdtToWphrs = await getPrice({
          poolAddress: poolAddressUsdtToWphrs,
          addresses: {
               "tokenA": usdtAddress,
               "tokenB": wphrsAddress
          }
     })
     let {balance: wphrsBalance, decimals: wphrsDecimals} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI)
     amountIn = Number(ethers.formatUnits(usdtBalance, usdtDecimals)) * amount / 100 // % from balance
     amountOut = (amountIn * priceUsdtToWphrs.tokenAToTokenB) * (1 - slippageTolerance)
     console.log("SWAP USDT/WPHRS")
     console.log(`usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     console.log({amountIn, amountOut})
     try {
          console.log("Swapping...")
          await multicallSwap({
               routerAddress: ROUTER_SWAP_ZENITH,
               tokenInAddress: usdtAddress,
               tokenOutAddress: wphrsAddress,
               amountIn: ethers.parseUnits(amountIn.toFixed(2).toString(), usdtDecimals),
               amountOut: ethers.parseUnits(amountOut.toFixed(7).toString(), wphrsDecimals),
               fee: Number(priceUsdtToWphrs.fee)
          });
          await sleep(timeout);
          ({balance: usdtBalance} = await getTokenBalance(signer.address, usdtAddress, ERC20ABI));
          ({balance: wphrsBalance} = await getTokenBalance(signer.address, wphrsAddress, ERC20ABI));
          console.log(`usdtBalance: ${ethers.formatUnits(usdtBalance, usdtDecimals)}, wphrsBalance: ${ethers.formatUnits(wphrsBalance, wphrsDecimals)}`)
     } catch (error) {
          console.error(error)
     }
}