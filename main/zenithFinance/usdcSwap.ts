import { wallet, provider, envLoaded } from "../setup"
import { multicall } from "@scripts/pharosNetwork/zenithFinance/swap"
import { pharosTokenAddress, pharosPoolAddressZenith } from "@scripts/lib/data"
import { getPrice } from "@scripts/utils/price"
import { sleep } from "@scripts/utils/time"
import { tokenBalance } from "@scripts/utils/balance"
import { randomAmount } from "@scripts/utils/amount"

const router = "0x1a4de519154ae51200b0ad7c90f7fac75547888a"
export default async function usdcSwapZenith() {
     const env = envLoaded()
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10
     const poolAddressUsdcUsdt = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/USDT")[0].address
     const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address

     const priceUsdcToUsdt = await getPrice({
          poolAddress: poolAddressUsdcUsdt,
          addresses: {
               tokenA: usdcAddress,
               tokenB: usdtAddress
          },
          provider
     })
     let {balance: usdcBalance, symbol: usdcSymbol, decimals: usdcDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: usdcAddress
     })

     const {symbol: usdtSymbol, decimals: usdtDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: usdtAddress
     })
     
     const slippageTolerance = 0.003 // 0.3%

     // Convert float price (like 0.1484) into scaled integer
     let priceScaled = BigInt(Math.floor(priceUsdcToUsdt.tokenAToTokenB * Number(10n ** usdtDecimals)))

     // amountIn: 10% of WPHRS balance
     let amountIn = usdcBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n

     // amountOut: (amountIn * priceScaled * (1 - slippage)) / DECIMALS_WPHRS
     let amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** usdcDecimals) * 1000n)
     console.log(`SWAP ${usdcSymbol}/${usdtSymbol}`)
     try {
          console.log("Swaping...")
          await multicall({
               router,
               tokenIn: usdcAddress,
               tokenOut: usdtAddress,
               amountIn,
               amountOut,
               fee: priceUsdcToUsdt.fee,
               signer: wallet.signer,
               deadline
          })
     } catch (error) {
          console.error(`Swap failed: ${error}`)
     }

     const ms = randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     })
     await sleep(ms)

     const poolAddressUsdcWphrs = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/PHRS")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS")[0].address

     const priceUsdcToWphrs = await getPrice({
          poolAddress: poolAddressUsdcWphrs,
          addresses: {
               tokenA: usdcAddress,
               tokenB: wphrsAddress
          },
          provider
     });

     ({balance: usdcBalance} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: usdcAddress
     }))
     let {symbol: wphrsSymbol, decimals: wphrsDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: wphrsAddress
     })
     priceScaled = BigInt(Math.floor(priceUsdcToWphrs.tokenAToTokenB * Number(10n ** wphrsDecimals)))
     amountIn = usdcBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n
     amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** usdcDecimals) * 1000n)
     console.log(`SWAP ${usdcSymbol}/${wphrsSymbol}`)
     try {
          console.log("Swaping...")
          await multicall({
               router,
               tokenIn: usdcAddress,
               tokenOut: wphrsAddress,
               amountIn,
               amountOut,
               fee: priceUsdcToWphrs.fee,
               signer: wallet.signer,
               deadline
          })
     } catch (error) {
          console.error(`Swap failed: ${error}`)
     }

}