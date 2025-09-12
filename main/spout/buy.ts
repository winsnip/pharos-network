import { wallet, provider, envLoaded } from "../setup"
import { buy } from "@scripts/pharosNetwork/spout/buy"
import { spoutAssets, pharosTokenAddress } from "@scripts/lib/data"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

async function main() {
     const env = envLoaded()
     const tokenIn = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
     const tokenOut = spoutAssets.filter(item => item.name == "sLQD")[0].address
     const router = "0x81b33972f8bdf14fd7968ac99cac59bcab7f4e9a"
     await buy({
          tokenIn,
          tokenOut,
          router,
          amountInPercent: 1,
          signer: wallet.signer,
          provider
     })
     await sleep(randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     }))
}
main().catch(e => failed({errorMessage: e}))