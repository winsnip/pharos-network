import * as dotenv from "dotenv";
import path from "path";
import { fetchWithProxyUndici } from "@scripts/utils/ip";
import { formatUnits, Wallet } from "ethers";
import { success } from "@scripts/utils/console";
import { headers } from "./headers";
import { sleep } from "@scripts/utils/time";

interface SendToken {
  baseDir: string;
  to: string;
  signer: Wallet;
  amount: bigint;
}

export async function directSendToken({
  baseDir,
  to,
  signer,
  amount,
}: SendToken) {
  dotenv.config({ path: path.join(baseDir, ".env") });
  const { PHAROS_TOKEN, PROXY_URL = "" } = process.env!;
  if (!PHAROS_TOKEN) {
    console.error("PHAROS ACCESS TOKEN NOT FOUND!");
    return;
  }
  const nonce = await signer.getNonce();
  console.log(`Sending ${formatUnits(amount, 18)} PHRS to ${to}...`);
  const tx = await signer.sendTransaction({
    to,
    value: amount,
    nonce,
  });
  await tx.wait();
  success({ hash: tx.hash });

  console.log("Verifying task...");
  await sleep(1000);
  let isVerified: boolean = false;
  let retryCount: number = 0;
  while (!isVerified) {
    const verify = await verifyTask({
      address: signer.address,
      tx_hash: tx.hash,
      proxyUrl: PROXY_URL,
      accessToken: PHAROS_TOKEN,
    });
    if (verify.data.verified) {
      console.log(verify.msg);
      isVerified = verify.data.verified;
      continue;
    }
    retryCount++;
    console.log(`Retrying ${retryCount}/3`);
    if (retryCount > 3) break;
    await sleep(2000);
  }
}

interface VerifyTask {
  address: string;
  tx_hash: string;
  proxyUrl: string;
  accessToken: string;
}
async function verifyTask({
  address,
  tx_hash,
  proxyUrl,
  accessToken,
}: VerifyTask) {
  const url = "https://api.pharosnetwork.xyz/task/verify";
  const response = await fetchWithProxyUndici({
    url,
    proxyUrl,
    method: "POST",
    headers: {
      ...headers,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      address,
      task_id: 401,
      tx_hash,
    }),
  });
  const result = JSON.parse(response.body);
  if (result.code != 0) {
    console.log(response.body);
    return false;
  }
  return result;
}
