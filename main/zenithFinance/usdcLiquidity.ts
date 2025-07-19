import { provider, wallet, envLoaded } from "../setup"
import { pharosPoolAddressZenith } from "@scripts/lib/data"
import { pharosTokenAddress } from "@scripts/lib/data"
import { liquidity } from "@scripts/pharosNetwork/zenithFinance/liquidity"
import { randomAmount } from "@scripts/utils/amount"
import { sleep } from "@scripts/utils/time"

const router = "0xf8a1d4ff0f9b9af7ce58e1fc1833688f3bfd6115"
export default async function usdcLiquidityZenith() {
     const env = envLoaded()
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10
     const poolAddressUsdcUsdt = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/USDT")[0].address
     const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address

     await liquidity({
          signer: wallet.signer,
          poolAddress: poolAddressUsdcUsdt,
          tokenA: usdcAddress,
          tokenB: usdtAddress,
          provider,
          amountInPercent: env.AMOUNT_IN_PERCENT,
          router,
          deadline
     })
     const ms = randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     })
     await sleep(ms)
     
     const poolAddressUsdcWphrs = pharosPoolAddressZenith.filter(pool => pool.pair == "USDC/PHRS")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS")[0].address

     await liquidity({
          signer: wallet.signer,
          poolAddress: poolAddressUsdcWphrs,
          tokenA: usdcAddress,
          tokenB: wphrsAddress,
          provider,
          amountInPercent: env.AMOUNT_IN_PERCENT,
          router,
          deadline
     })
}