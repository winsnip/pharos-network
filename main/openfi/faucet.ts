import { failed } from "@scripts/utils/console"
import { envLoaded, wallet } from "../setup"
import { faucet } from "@scripts/pharosNetwork/lendBorrowOpenfi/faucet"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++) {
          console.log(`Task faucet openfi ${index}/${env.LOOP_COUNT}`)
          await faucet({
               signer: wallet.signer
          })
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(e => failed({ errorMessage: e }))