import { wallet, provider, envLoaded } from "../setup"
import { pharosTokenAddress } from "@scripts/lib/data"
import { swap } from "@scripts/pharosNetwork/rwafiR2/swap"
import { randomAmount } from "@scripts/utils/amount"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"

async function main() {
     const env = envLoaded()
     const router = "0x4f5b54d4af2568cefafa73bb062e5d734b55aa05"
     const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC_R2")[0].address
     const r2usdAddress = pharosTokenAddress.filter(item => item.name == "R2USD")[0].address

     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task rwafi-R2 swap ${index}/${env.LOOP_COUNT}`)
          await swap({
               tokenIn: usdcAddress,
               tokenOut: r2usdAddress,
               router,
               signer: wallet.signer,
               provider,
               amountInPercent: env.AMOUNT_IN_PERCENT
          })
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
          await swap({
               tokenIn: r2usdAddress,
               tokenOut: usdcAddress,
               router,
               signer: wallet.signer,
               provider,
               amountInPercent: env.AMOUNT_IN_PERCENT
          })
     }
}
main().catch(e => failed({ errorMessage: e }))