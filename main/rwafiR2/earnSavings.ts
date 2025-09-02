import { wallet, provider, envLoaded } from "../setup"
import { pharosTokenAddress } from "@scripts/lib/data"
import { swap } from "@scripts/pharosNetwork/rwafiR2/earnSavings"
import { randomAmount } from "@scripts/utils/amount"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"

async function main() {
     const env = envLoaded()
     const router = "0xf8694d25947a0097cb2cea2fc07b071bdf72e1f8"
     const sr2usdAddress = pharosTokenAddress.filter(item => item.name == "SR2USD")[0].address
     const r2usdAddress = pharosTokenAddress.filter(item => item.name == "R2USD")[0].address

     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task rwafi-R2 earn ${index}/${env.LOOP_COUNT}`)
          await swap({
               tokenIn: r2usdAddress,
               tokenOut: sr2usdAddress,
               router,
               signer: wallet.signer,
               provider,
               amountInPercent: env.AMOUNT_IN_PERCENT
          })
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(e => failed({ errorMessage: e }))