import { sleep } from "@scripts/utils/time"
import { wallet, provider, envLoaded } from "../setup"
import { deposit } from "@scripts/pharosNetwork/bitverse/deposit"
import { randomAmount } from "@scripts/utils/amount"
import { failed } from "@scripts/utils/console"

const router = "0xa307ce75bc6ef22794410d783e5d4265ded1a24f"
const usdtAddress = "0xD4071393f8716661958F766DF660033b3d35fD29"
async function main() {
     const env = envLoaded()
     await deposit({
          signer: wallet.signer,
          provider,
          router,
          amountInPercent: env.AMOUNT_IN_PERCENT,
          tokenAddress: usdtAddress
     })
     await sleep(randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     }))
}
main().catch(e => failed({errorMessage: e}))