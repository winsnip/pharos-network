import { fetchWithProxyUndici } from "@scripts/utils/ip";
import { headers } from "./headers";

const body = {
  leverageE2: 500,
  allowedSlippage: "10",
  isV2: "0",
};

interface GetData {
  marginAmount: string;
  pair: string;
  price: string;
  side: number;
  proxyUrl: string;
  orderType: number;
  address: string;
}

export async function getData({
  marginAmount,
  pair,
  price,
  side,
  proxyUrl,
  orderType,
  address,
}: GetData) {
  const url =
    "https://api.bitverse.zone/bitverse/trade-data/v1/order/simulation/pendingOrder";
  const response = await fetchWithProxyUndici({
    url,
    proxyUrl,
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json, text/plain, */*",
    },
    body: JSON.stringify({
      ...body,
      side,
      pair,
      price,
      margin: [{ denom: "USDT", amount: marginAmount }],
      orderType,
      address,
    }),
  });
  const json = JSON.parse(response.body);
  if (json.retCode != 0) {
    console.log(json.retMsg);
    return;
  }
  const {
    leverageE2,
    entryPrice,
    margin,
    longOI,
    shortOI,
    signTimestamp,
    sign,
    marketOpening,
  } = json.result;
  return {
    leverageE2,
    entryPrice,
    margin,
    longOI,
    shortOI,
    signTimestamp,
    sign,
    marketOpening,
  };
}
