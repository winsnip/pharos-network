import path from "path"
import { wallet, provider, envLoaded } from "../setup"
import { register } from "@scripts/pharosNetwork/pns"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

const baseDir = path.resolve(__dirname, "../")

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++){
          console.log(`Task pharos name service ${index}/${env.LOOP_COUNT}`)
          try {
               await register({
                    baseDir,
                    signer: wallet.signer,
                    days: 30,
                    provider
               })
          } catch (error) {
               failed({ errorMessage: error })
          }
     
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(console.error)