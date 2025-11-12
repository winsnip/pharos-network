import path from "path";
import { openPosition } from "@scripts/pharosNetwork/atlantic/bitverse/openPosition";
import { wallet, provider, envLoaded } from "../setup";
import { failed } from "@scripts/utils/console";
import { randomAmount } from "@scripts/utils/amount";
import { bitverseListPair } from "@scripts/lib/data";
import { sleep } from "@scripts/utils/time";

const baseDir = path.resolve(__dirname, "../../");
const router = "0xeA2fC1300ac31Afd77Cf5d5D240B69e38308a90C";
async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Bitverse open position ${index}/${env.LOOP_COUNT}`);
    const indexAssets = Math.floor(
      randomAmount({
        min: 0,
        max: bitverseListPair.length,
      })
    );
    // side: 1 Long, 2 Short
    const side = Math.floor(
      randomAmount({
        min: 1,
        max: 3,
      })
    );
    // orderType: 1 Market, 2 Limit
    const orderType = Math.floor(
      randomAmount({
        min: 1,
        max: 3,
      })
    );
    const pair = bitverseListPair[indexAssets];
    await openPosition({
      baseDir,
      side,
      pair,
      provider,
      signer: wallet.signer,
      router,
      orderType,
    });
    await sleep(
      randomAmount({
        min: env.TIMEOUT_MIN_MS,
        max: env.TIMEOUT_MAX_MS,
      })
    );
  }
}
main().catch((e) => failed({ errorMessage: e }));
