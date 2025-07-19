import { provider, wallet, envLoaded } from "../setup"
import { pharosPoolAddressZenith } from "@scripts/lib/data"
import { pharosTokenAddress } from "@scripts/lib/data"
import { liquidity } from "@scripts/pharosNetwork/zenithFinance/liquidity"

const router = "0xf8a1d4ff0f9b9af7ce58e1fc1833688f3bfd6115"
export default async function wphrsLiquidityZenith() {
     const env = envLoaded()
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10
     const poolAddressUsdtWphrs = pharosPoolAddressZenith.filter(pool => pool.pair == "USDT/PHRS")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS")[0].address
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address

     await liquidity({
          signer: wallet.signer,
          poolAddress: poolAddressUsdtWphrs,
          tokenA: wphrsAddress,
          tokenB: usdtAddress,
          provider,
          amountInPercent: env.AMOUNT_IN_PERCENT,
          router,
          deadline
     })
}