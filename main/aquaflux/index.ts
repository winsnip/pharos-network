import path from "path"
import { mint } from "@scripts/pharosNetwork/rwafiAquaflux"
import { wallet } from "../setup"
import { selectors } from "@scripts/pharosNetwork/rwafiAquaflux/data"
import { envLoaded } from "../setup"
import { sleep } from "@scripts/utils/time"
import { randomAmount } from "@scripts/utils/amount"

const baseDir = path.resolve(__dirname,"../")

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++){
          console.log(`Task rwafi aquaflux ${index}/${env.LOOP_COUNT}`)
          for(const [index,selector] of selectors.entries()){
               console.log(`Selector ${index+1}/${selectors.length}`)
               await mint({
                    signer: wallet.signer,
                    baseDir,
                    selector
               })
               await sleep(randomAmount({
                    min: env.TIMEOUT_MIN_MS,
                    max: env.TIMEOUT_MAX_MS
               }))
          }
     }
}
main().catch(console.error)