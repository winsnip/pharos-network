import { wallet, provider, envLoaded } from "../setup"
import { multicall } from "@scripts/pharosNetwork/zenithFinance/swap"
import { pharosTokenAddress, pharosPoolAddressZenith } from "@scripts/lib/data"
import { getPrice } from "@scripts/utils/price"
import { sleep } from "@scripts/utils/time"
import { tokenBalance } from "@scripts/utils/balance"
import { randomAmount } from "@scripts/utils/amount"

const router = "0x1a4de519154ae51200b0ad7c90f7fac75547888a"
export default async function usdtSwapZenith() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task swap usdt ${index}/${env.LOOP_COUNT}`)
          const deadline = Math.floor(Date.now() / 1000) + 60 * 10
          const poolAddressUsdtUsdc = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/USDT")[0].address
          const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
          const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address

          const priceUsdtUsdc = await getPrice({
               poolAddress: poolAddressUsdtUsdc,
               addresses: {
                    tokenA: usdtAddress,
                    tokenB: usdcAddress
               },
               provider
          })
          let { balance: usdtBalance, symbol: usdtSymbol, decimals: usdtDecimals } = await tokenBalance({
               address: wallet.address,
               provider,
               tokenAddress: usdtAddress
          })

          const { symbol: usdcSymbol, decimals: usdcDecimals } = await tokenBalance({
               address: wallet.address,
               provider,
               tokenAddress: usdcAddress
          })

          const slippageTolerance = 0.003
          let priceScaled = BigInt(Math.floor(priceUsdtUsdc.tokenAToTokenB * Number(10n ** usdcDecimals)))
          let amountIn = usdtBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n
          let amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** usdtDecimals) * 1000n)
          console.log(`SWAP ${usdtSymbol}/${usdcSymbol}`)
          try {
               console.log("Swaping...")
               await multicall({
                    router,
                    tokenIn: usdtAddress,
                    tokenOut: usdcAddress,
                    amountIn,
                    amountOut,
                    fee: priceUsdtUsdc.fee,
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

          const poolAddressUsdtWphrs = pharosPoolAddressZenith.filter(pool => pool.pair == "USDT/PHRS")[0].address
          const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS")[0].address

          const priceUsdtWphrs = await getPrice({
               poolAddress: poolAddressUsdtWphrs,
               addresses: {
                    tokenA: usdtAddress,
                    tokenB: wphrsAddress
               },
               provider
          });

          ({ balance: usdtBalance } = await tokenBalance({
               address: wallet.address,
               provider,
               tokenAddress: usdtAddress
          }))
          let { symbol: wphrsSymbol, decimals: wphrsDecimals } = await tokenBalance({
               address: wallet.address,
               provider,
               tokenAddress: wphrsAddress
          })

          priceScaled = BigInt(Math.floor(priceUsdtWphrs.tokenAToTokenB * Number(10n ** wphrsDecimals)))
          amountIn = usdtBalance * BigInt(env.AMOUNT_IN_PERCENT) / 100n
          amountOut = (amountIn * priceScaled * BigInt(1000 - Math.floor(slippageTolerance * 1000))) / ((10n ** usdtDecimals) * 1000n)
          console.log(`SWAP ${usdtSymbol}/${wphrsSymbol}`)
          try {
               console.log("Swaping...")
               await multicall({
                    router,
                    tokenIn: usdtAddress,
                    tokenOut: wphrsAddress,
                    amountIn,
                    amountOut,
                    fee: priceUsdtWphrs.fee,
                    signer: wallet.signer,
                    deadline
               })
          } catch (error) {
               console.error(`Swap failed: ${error}`)
          }
     }

}

usdtSwapZenith().catch(console.error)