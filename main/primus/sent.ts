import { tip } from "@scripts/pharosNetwork/primus/sent"
import { wallet } from "../setup"
import { envLoaded } from "../setup"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++){
          console.log(`Task primus ${index}/${env.LOOP_COUNT}`)
          await tip({
               wallet: wallet.signer
          })
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(console.error)
