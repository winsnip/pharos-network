import { directSendToken } from "@scripts/pharosNetwork/atlantic/sendToken/directOnchain";
import { baseDir, wallet, provider} from "../setup";
import { envLoaded } from "main/setup";
import { parseEther } from "ethers";
import { failed } from "@scripts/utils/console";
import { getActiveAddressOnChain } from "@scripts/utils/address";
import { rpcList } from "@scripts/lib/data";
import { coinBalance } from "@scripts/utils/balance";
import { randomAmount } from "@scripts/utils/amount";
import { sleep } from "@scripts/utils/time";

const MIN_AMOUNT = 0.0001;
async function main() {
  const env = envLoaded();
  const addresses: string[] = await getActiveAddressOnChain({
    rpc: rpcList.atlantic_pharos_testnet,
    countAddress: env.LOOP_COUNT,
  });

  for (const [index, address] of Array.from(addresses).entries()) {
    console.log(`Running ${index + 1}/${addresses.length}`);
    const balance: string = await coinBalance({
      address: wallet.address,
      provider,
    });
    if (Number(balance) < MIN_AMOUNT) {
      console.log(
        `Insufficient balance, your balance: ${balance}. min balance: ${MIN_AMOUNT}`
      );
      return;
    }
    const amount: string = randomAmount({
      min: MIN_AMOUNT,
      max: 0.001,
    }).toFixed(4);

    await directSendToken({
      baseDir,
      to: address,
      signer: wallet.signer,
      amount: parseEther(amount),
    });
    if (index + 1 == addresses.length) return;
    await sleep(
      randomAmount({
        min: env.TIMEOUT_MIN_MS,
        max: env.TIMEOUT_MAX_MS,
      })
    );
  }
}
main().catch((error) => failed({ errorMessage: error }));
