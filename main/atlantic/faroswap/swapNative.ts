import * as dotenv from "dotenv";
import path from "path";
import { listToken, Token } from "@scripts/pharosNetwork/atlantic/generalData";
import { randomAmount } from "@scripts/utils/amount";
import { coinBalance } from "@scripts/utils/balance";
import { failed } from "@scripts/utils/console";
import { wallet, provider, envLoaded } from "../setup";
import { parseEther } from "ethers";
import { swap } from "@scripts/pharosNetwork/atlantic/faroswap/swap";
import { sleep } from "@scripts/utils/time";

const MIN_BALANCE: number = 0.0001;
dotenv.config({ path: path.join(__dirname, "../../.env") });
async function main() {
  const env = envLoaded();
  const { PROXY_URL } = process.env;
  const randomIndex = Math.floor(
    randomAmount({
      min: 0,
      max: listToken.length - 1,
    })
  );
  const native: string = listToken.filter((token) => token.name == "native")[0]
    .address;
  const balanceNative: string = await coinBalance({
    address: wallet.address,
    provider,
  });
  if (Number(balanceNative) < MIN_BALANCE) {
    throw Error(
      `Insufficient balance, Min: ${MIN_BALANCE}, your: ${balanceNative}`
    );
  }
  const amountIn: bigint = parseEther(
    `${((Number(balanceNative) * env.AMOUNT_IN_PERCENT) / 100).toFixed(4)}`
  );
  const deadline: number = Math.floor(Date.now() / 1000) + 60 * 20;
  const toRandomToken: Token = listToken[randomIndex];
  console.log(`Swap phrs/${toRandomToken.name}`);
  await swap({
    tokenIn: native,
    tokenOut: toRandomToken.address,
    deadline,
    signer: wallet.signer,
    amountIn,
    proxyUrl: PROXY_URL!,
  });

  await sleep(
    randomAmount({ min: env.TIMEOUT_MIN_MS, max: env.TIMEOUT_MAX_MS })
  );
}
main().catch((error) => failed({ errorMessage: error }));
