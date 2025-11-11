import { Swap, routerAddress, urlRoute } from "./data";
import { fetchWithProxyUndici } from "@scripts/utils/ip";
import { headers } from "./header";
import { success } from "@scripts/utils/console";
import { approve } from "@scripts/utils/approve";

export async function swap({
  tokenIn,
  tokenOut,
  deadline,
  signer,
  amountIn,
  proxyUrl,
}: Swap) {
  const urlUpdate = new URL(urlRoute);
  urlUpdate.searchParams.append("deadLine", `${deadline}`);
  urlUpdate.searchParams.append("toTokenAddress", tokenOut);
  urlUpdate.searchParams.append("fromTokenAddress", tokenIn);
  urlUpdate.searchParams.append("userAddr", signer.address);
  urlUpdate.searchParams.append("fromAmount", `${amountIn}`);

  const getData = await fetchWithProxyUndici({
    url: urlUpdate.toString(),
    proxyUrl,
    method: "GET",
    headers,
  });
  const data = JSON.parse(getData.body);
  if (data.status != 200) {
    throw Error(data.data);
  }
  if (data?.data?.hasOwnProperty("targetApproveAddr")) {
    await approve({
      tokenAddress: tokenIn,
      signer,
      router: data?.data?.targetApproveAddr,
      amount: amountIn,
    });
  }
  console.log("Sending transaction...");
  const tx = await signer.sendTransaction({
    to: routerAddress,
    data: data?.data?.data,
    gasLimit: 550_000,
    value: data?.data?.value,
  });
  await tx.wait();
  success({ hash: tx.hash });
}
