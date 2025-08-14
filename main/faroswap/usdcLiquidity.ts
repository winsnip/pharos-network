import { wallet, provider, envLoaded } from "../setup"
import { pharosTokenAddress } from "@scripts/lib/data"
import { createLiquidity } from "@scripts/pharosNetwork/faroswap/liquidity"
import { pharosPoolAddressPMMFaroswap } from "@scripts/lib/data"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

export default async function usdcLiquidityFaros() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task lp usdc ${index}/${env.LOOP_COUNT}`)
          const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
          const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS_FAROSWAP")[0].address
          let poolAddresses = pharosPoolAddressPMMFaroswap.filter(item => item.pair == "USDC/WPHRS")[0]

          for (let poolAddress of poolAddresses.address) {
               let deadline = Math.floor(Date.now() / 1000) + 60 * 10
               await createLiquidity({
                    poolAddress: poolAddress,
                    tokenIn: usdcAddress,
                    tokenOut: wphrsAddress,
                    deadline,
                    signer: wallet.signer,
                    amountIn_inPercent: env.AMOUNT_IN_PERCENT,
                    provider
               })
               let ms = randomAmount({
                    min: env.TIMEOUT_MIN_MS,
                    max: env.TIMEOUT_MAX_MS
               })
               await sleep(ms)
          }

          const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address
          poolAddresses = pharosPoolAddressPMMFaroswap.filter(item => item.pair == "USDT/USDC")[0]
          for (let poolAddress of poolAddresses.address) {
               let deadline = Math.floor(Date.now() / 1000) + 60 * 10
               await createLiquidity({
                    poolAddress: poolAddress,
                    tokenIn: usdcAddress,
                    tokenOut: usdtAddress,
                    deadline,
                    signer: wallet.signer,
                    amountIn_inPercent: env.AMOUNT_IN_PERCENT,
                    provider
               })
               let ms = randomAmount({
                    min: env.TIMEOUT_MIN_MS,
                    max: env.TIMEOUT_MAX_MS
               })
               await sleep(ms)
          }
     }
}

usdcLiquidityFaros().catch(console.error)