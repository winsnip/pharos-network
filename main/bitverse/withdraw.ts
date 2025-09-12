import path from "path"
import { sleep } from "@scripts/utils/time"
import { wallet, provider, envLoaded } from "../setup"
import { withdraw } from "@scripts/pharosNetwork/bitverse/withdraw"
import { randomAmount } from "@scripts/utils/amount"
import { failed } from "@scripts/utils/console"

const baseDir = path.resolve(__dirname, "..")
const router = "0xa307ce75bc6ef22794410d783e5d4265ded1a24f"
async function main() {
     const env = envLoaded()
     await withdraw({
          signer: wallet.signer,
          baseDir,
          router,
          amountInPercent: env.AMOUNT_IN_PERCENT,
          provider
     })
     await sleep(randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     }))
}
main().catch(e => failed({errorMessage: e}))