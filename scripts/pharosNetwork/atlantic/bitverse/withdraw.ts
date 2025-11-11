import * as dotenv from "dotenv";
import path from "path";
import { bitverseAbi } from "@scripts/lib/data";
import { success } from "@scripts/utils/console";
import {
  Contract,
  formatUnits,
  JsonRpcProvider,
  parseUnits,
  Wallet,
} from "ethers";
import { fetchWithProxyUndici } from "@scripts/utils/ip";
import { tokenBalance } from "@scripts/utils/balance";
import { headers } from "./headers";

interface AccountUSDTBalanceParams {
  signer: Wallet;
  proxyUrl?: string;
  provider: JsonRpcProvider;
}

interface WithdrawParams extends AccountUSDTBalanceParams {
  baseDir: string;
  router: string;
  amountInPercent: number;
}

export async function withdraw({
  signer,
  router,
  baseDir,
  amountInPercent,
  provider,
}: WithdrawParams) {
  dotenv.config({ path: path.join(baseDir, ".env") });
  const { PROXY_URL = "" } = process.env!;

  console.log("Fetching USDT balance...");
  const usdtBalance = await accountUSDTBalance({
    signer,
    provider,
    proxyUrl: PROXY_URL,
  });

  if (!usdtBalance) {
    return;
  }

  const { decimalsToken, availableBalanceSize, contractAddress, coinName } =
    usdtBalance;

  if (Number(availableBalanceSize) < 0.002) {
    console.log(
      `Minimal withdrawl: 1 ${coinName}, your balance: ${availableBalanceSize} ${coinName}`
    );
    return;
  }
  const amount =
    (parseUnits(availableBalanceSize.split(".")[0], Number(decimalsToken)) *
      BigInt(amountInPercent)) /
    100n;
  console.log(
    `Withdrawing ${formatUnits(amount, Number(decimalsToken))} ${coinName}`
  );
  const contractRouter = new Contract(router, bitverseAbi, signer);
  const tx = await contractRouter.withdraw(contractAddress, amount);
  await tx.wait();
  success({ hash: tx.hash });
}

export async function accountUSDTBalance({
  signer,
  provider,
  proxyUrl,
}: AccountUSDTBalanceParams): Promise<{
  decimalsToken: number;
  availableBalanceSize: string;
  contractAddress: string;
  coinName: string;
} | void> {
  const url =
    "https://api.bitverse.zone/bitverse/trade-data/v1/account/balance/allCoinBalance";
  const response = await fetchWithProxyUndici({
    url,
    proxyUrl,
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: signer.address,
    }),
  });
  const json = JSON.parse(response.body);
  if (json.retCode == 10016) {
    console.log(json.retMsg);
    return;
  }
  const { availableBalanceSize, contractAddress, coinName } =
    json.result.coinBalance.filter(
      (item: { coinName: string }) => item.coinName == "USDT"
    )[0];
  const { decimals: decimalsToken } = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: contractAddress,
  });

  return { decimalsToken, availableBalanceSize, contractAddress, coinName };
}
