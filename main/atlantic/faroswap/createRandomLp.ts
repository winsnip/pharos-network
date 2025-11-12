import { createLP } from "@scripts/pharosNetwork/atlantic/faroswap/liquidProvider";
import { wallet, provider, envLoaded } from "../setup";
import {
  poolAddressesAMM,
  routerPoolAMM,
} from "@scripts/pharosNetwork/atlantic/faroswap/data";
import { failed } from "@scripts/utils/console";
import { randomAmount } from "@scripts/utils/amount";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Faroswap create liquidity ${index}/${env.LOOP_COUNT}`);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const randomIndex = Math.floor(
      randomAmount({
        min: 0,
        max: poolAddressesAMM.length,
      })
    );
    await createLP({
      poolAddress: poolAddressesAMM[randomIndex],
      signer: wallet.signer,
      deadline: BigInt(deadline),
      router: routerPoolAMM,
      provider,
      amountInPercent: 1,
    });
    await sleep(
      randomAmount({
        min: env.TIMEOUT_MIN_MS,
        max: env.TIMEOUT_MAX_MS,
      })
    );
  }
}
main().catch((error) => failed({ errorMessage: error }));
