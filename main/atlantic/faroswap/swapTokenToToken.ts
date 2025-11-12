import * as dotenv from "dotenv";
import path from "path";
import { listToken, Token } from "@scripts/pharosNetwork/atlantic/generalData";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { failed } from "@scripts/utils/console";
import { wallet, provider, envLoaded } from "../setup";
import { formatUnits, parseUnits } from "ethers";
import { swap } from "@scripts/pharosNetwork/atlantic/faroswap/swap";
import { sleep } from "@scripts/utils/time";

const MIN_BALANCE: number = 0.0001;
dotenv.config({ path: path.join(__dirname, "../../.env") });
async function main() {
  const env = envLoaded();
  const { PROXY_URL } = process.env!;
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Faroswap swap token to token ${index}/${env.LOOP_COUNT}`);
    const nonNativeToken = listToken.filter((token) => token.name !== "native");
    const randomIndex = Math.floor(
      randomAmount({
        min: 0,
        max: nonNativeToken.length,
      })
    );
    let tokenIn: Token = nonNativeToken[randomIndex];
    console.log(`TokenIn: ${tokenIn.name}`);
    const { balance, decimals } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: tokenIn.address,
    });
    if (balance < parseUnits(`${MIN_BALANCE}`, decimals)) {
      throw Error(
        `Insufficient balance, Min: ${MIN_BALANCE}, your: ${formatUnits(
          balance,
          decimals
        )}`
      );
    }

    const amountIn: bigint = parseUnits(
      `${(
        (Number(formatUnits(balance, decimals)) * env.AMOUNT_IN_PERCENT) /
        100
      ).toFixed(Number(decimals))}`,
      decimals
    );
    const deadline: number = Math.floor(Date.now() / 1000) + 60 * 20;
    let toRandomIndex: number;
    let toRandomToken: Token;
    do {
      toRandomIndex = Math.floor(
        randomAmount({
          min: 0,
          max: listToken.length,
        })
      );
      toRandomToken = listToken[toRandomIndex];
    } while (toRandomToken.address === tokenIn.address);

    console.log(`Swap ${tokenIn.name}/${toRandomToken.name}`);
    await swap({
      tokenIn: tokenIn.address,
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
}
main().catch((error) => failed({ errorMessage: error }));
