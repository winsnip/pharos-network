import { sleep } from "@scripts/utils/time";
import { wallet, provider, envLoaded } from "../setup";
import { deposit } from "@scripts/pharosNetwork/atlantic/bitverse/deposit";
import { randomAmount } from "@scripts/utils/amount";
import { failed } from "@scripts/utils/console";

const router = "0xecbac797f28f412ddf0d38b50f5b4a6904d46e0a";
const usdtAddress = "0xE7E84B8B4f39C507499c40B4ac199B050e2882d5";
async function main() {
  const env = envLoaded();
  await deposit({
    signer: wallet.signer,
    provider,
    router,
    amountInPercent: env.AMOUNT_IN_PERCENT,
    tokenAddress: usdtAddress,
  });
  await sleep(
    randomAmount({
      min: env.TIMEOUT_MIN_MS,
      max: env.TIMEOUT_MAX_MS,
    })
  );
}
main().catch((e) => failed({ errorMessage: e }));
