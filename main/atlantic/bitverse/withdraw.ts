import path from "path";
import { sleep } from "@scripts/utils/time";
import { wallet, provider, envLoaded } from "../setup";
import { withdraw } from "@scripts/pharosNetwork/atlantic/bitverse/withdraw";
import { randomAmount } from "@scripts/utils/amount";
import { failed } from "@scripts/utils/console";

const baseDir = path.resolve(__dirname, "../../");
const router = "0xEcbAc797f28f412ddF0D38B50f5B4a6904d46e0A";
async function main() {
  const env = envLoaded();
  await withdraw({
    signer: wallet.signer,
    baseDir,
    router,
    amountInPercent: env.AMOUNT_IN_PERCENT,
    provider,
  });
  await sleep(
    randomAmount({
      min: env.TIMEOUT_MIN_MS,
      max: env.TIMEOUT_MAX_MS,
    })
  );
}
main().catch((e) => failed({ errorMessage: e }));
