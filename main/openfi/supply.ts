import { wallet, provider, envLoaded } from "../setup"
import { supply } from "@scripts/pharosNetwork/lendBorrowOpenfi/supply"
import { openFiAssets } from "@scripts/lib/data"
import { randomAmount } from "@scripts/utils/amount"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task supply openfi ${index}/${env.LOOP_COUNT}`)
          const indexAsset = Math.floor(randomAmount({
               min: 0,
               max: Number(openFiAssets.length - 1)
          }))
          const tokenAddress = openFiAssets[indexAsset].address
          await supply({
               signer: wallet.signer,
               tokenAddress,
               amountInPercent: env.AMOUNT_IN_PERCENT,
               provider
          })
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(e => failed({ errorMessage: e }))