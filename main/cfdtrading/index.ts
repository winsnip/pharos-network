import path from "path"
import { OpenPosition } from "@scripts/pharosNetwork/cfdtrading"
import { wallet,provider, envLoaded } from "../setup"
import { failed } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

const baseDir = path.resolve(__dirname, "..")
async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++){
          console.log(`Task cfd trading brokex ${index}/${env.LOOP_COUNT}`)
          try{
               await OpenPosition({
                    baseDir,
                    signer: wallet.signer,
                    provider
               })
          }catch(error){
               typeof error == "object" && error != null && "reason" in error ? failed({errorMessage: error.reason}) : failed({errorMessage: error})
          }
          await sleep(randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          }))
     }
}
main().catch(console.error)