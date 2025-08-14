import { faucet } from "@scripts/pharosNetwork/autostaking/faucet"
import { envLoaded, wallet } from "../setup"
import { randomAmount } from "@scripts/utils/amount"
import { sleep } from "@scripts/utils/time"
import { failed } from "@scripts/utils/console"

async function main() {
     const env = envLoaded()
     try {
          await faucet({
               signer: wallet.signer
          })
     } catch (error) {
          failed({ errorMessage: error })
     }
     const ms = randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     })
     await sleep(ms)
}
main().catch(console.error)