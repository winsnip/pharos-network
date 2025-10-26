import { assetoAbi, assetoAddresses } from "@scripts/lib/data";
import { wallet, provider } from "../setup";
import { envLoaded } from "main/setup";
import { tokenBalance } from "@scripts/utils/balance";
import { formatUnits } from "ethers";
import { subscribe } from "@scripts/pharosNetwork/atlantic/rwafi/asseto";
import { failed } from "@scripts/utils/console";
import { sleep } from "@scripts/utils/time";
import { randomAmount } from "@scripts/utils/amount";

async function main() {
  const env = envLoaded();
  const tokenIn: string = assetoAddresses.filter(
    (address) => address.name == "USDT"
  )[0].contract;
  const spender: string = assetoAddresses.filter(
    (address) => address.name == "SPENDER"
  )[0].contract;

  for(let index = 1; index <= env.LOOP_COUNT; index++){
    console.log(`Task asseto subscription ${index}/${env.LOOP_COUNT}`)
    const tokenInDetail = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: tokenIn,
    });
    if (tokenInDetail.balance == 0n) {
      console.log(
        `Insufficient balance: ${formatUnits(
          tokenInDetail.balance,
          tokenInDetail.decimals
        )} ${tokenInDetail.symbol}`
      );
      return;
    }
    const amountIn =
      (tokenInDetail.balance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    await subscribe({
      tokenIn,
      amount: amountIn,
      spender,
      signer: wallet.signer,
      abi: assetoAbi,
      metadataTokenIn: tokenInDetail,
    });
    if(index == env.LOOP_COUNT) return
    await sleep(
      randomAmount({
        min: env.TIMEOUT_MIN_MS,
        max: env.TIMEOUT_MAX_MS,
      })
    );
  }
}
main().catch((error) => failed({ errorMessage: error }));
