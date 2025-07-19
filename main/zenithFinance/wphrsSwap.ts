import { wallet, provider, envLoaded } from "../setup"
import { multicall } from "@scripts/pharosNetwork/zenithFinance/swap"
import { pharosTokenAddress, pharosPoolAddressZenith } from "@scripts/lib/data"
import { getPrice } from "@scripts/utils/price"
import { sleep } from "@scripts/utils/time"
import { tokenBalance } from "@scripts/utils/balance"
import { randomAmount } from "@scripts/utils/amount"

const router = "0x1a4de519154ae51200b0ad7c90f7fac75547888a"
export default async function wphrsSwapZenith() {
     const env = envLoaded()
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10
     const poolAddressWphrsUsdc = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/PHRS")[0].address
     const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS")[0].address
     

     const priceWphrsUsdc = await getPrice({
          poolAddress: poolAddressWphrsUsdc,
          addresses: {
               tokenA: wphrsAddress,
               tokenB: usdcAddress
          },
          provider
     })
     let {balance: wphrsBalance, symbol: wphrsSymbol, decimals: wphrsDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: wphrsAddress
     })

     const {symbol: usdcSymbol, decimals: usdcDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: usdcAddress
     })

     const slippageTolerance = 0.003 // 0.3%

     // Convert float price (like 0.1484) into scaled integer
     let priceScaled = BigInt(Math.floor(priceWphrsUsdc.tokenAToTokenB * Number(10n ** usdcDecimals)))

     // amountIn: 10% of WPHRS balance
     let amountIn = wphrsBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n

     // amountOut: (amountIn * priceScaled * (1 - slippage)) / DECIMALS_WPHRS
     let amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** wphrsDecimals) * 1000n)

     console.log(`SWAP ${wphrsSymbol}/${usdcSymbol}`)
     try {
          console.log("Swaping...")
          await multicall({
               router,
               tokenIn: wphrsAddress,
               tokenOut: usdcAddress,
               amountIn,
               amountOut,
               fee: priceWphrsUsdc.fee,
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

     const poolAddressWphrsUsdt = pharosPoolAddressZenith.filter(pool => pool.pair == "USDT/PHRS")[0].address
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address

     const priceWphrsUsdt = await getPrice({
          poolAddress: poolAddressWphrsUsdt,
          addresses: {
               tokenA: wphrsAddress,
               tokenB: usdtAddress
          },
          provider
     });

     ({balance: wphrsBalance} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: wphrsAddress
     }))
     let {symbol: usdtSymbol, decimals: usdtDecimals} = await tokenBalance({
          address: wallet.address,
          provider,
          tokenAddress: usdtAddress
     })
     priceScaled = BigInt(Math.floor(priceWphrsUsdt.tokenAToTokenB * Number(10n ** usdtDecimals)))
     amountIn = wphrsBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n
     amountOut = amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** wphrsDecimals) * 1000n)
     console.log(`SWAP ${wphrsSymbol}/${usdtSymbol}`)
     try {
          console.log("Swaping...")
          await multicall({
               router,
               tokenIn: wphrsAddress,
               tokenOut: usdtAddress,
               amountIn,
               amountOut,
               fee: priceWphrsUsdt.fee,
               signer: wallet.signer,
               deadline
          })
     } catch (error) {
          console.error(`Swap failed: ${error}`)
     }

}