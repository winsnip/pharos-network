import { wallet, provider, envLoaded } from "../setup"
import { pharosTokenAddress } from "@scripts/lib/data"
import { createLiquidity } from "@scripts/pharosNetwork/faroswap/liquidity"
import { pharosPoolAddressPMMFaroswap } from "@scripts/lib/data"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

export default async function usdtLiquidityFaros() {
     const env = envLoaded()
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS_FAROSWAP")[0].address
     const poolAddresses = pharosPoolAddressPMMFaroswap.filter(item => item.pair == "USDT/WPHRS")[0]
          
     for(let poolAddress of poolAddresses.address){
          let deadline = Math.floor(Date.now() / 1000) + 60 * 10
          await createLiquidity({
               poolAddress: poolAddress,
               tokenIn: usdtAddress,
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
}