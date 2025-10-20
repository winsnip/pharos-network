import * as dotenv from "dotenv"
import path from "path"
import { accountUSDTBalance } from "./withdraw"
import { JsonRpcProvider, parseUnits, Wallet, Interface } from "ethers"
import { getPrice } from "./price"
import { getData } from "./data"
import { success } from "@scripts/utils/console"
import { randomAmount } from "@scripts/utils/amount"

interface OpenPosition {
  baseDir: string,
  side: number,
  pair: string,
  signer: Wallet,
  provider: JsonRpcProvider,
  router: string,
  orderType: number
}

export async function openPosition({
  baseDir,
  side,
  pair,
  signer,
  provider,
  router,
  orderType
}: OpenPosition) {

  dotenv.config({ path: path.join(baseDir, ".env") })
  const { PROXY_URL = "" } = process.env!

  console.log("Fetching account balance...")
  const usdtBalance = await accountUSDTBalance({
    signer,
    provider,
    proxyUrl: PROXY_URL
  })
  if (!usdtBalance) {
    return
  }
  const { decimalsToken, availableBalanceSize, contractAddress, coinName } = usdtBalance
  console.log(`Account balance: ${availableBalanceSize} ${coinName}`)

  console.log(`Fetching price ${pair}`)
  const price = await getPrice({
    proxyUrl: PROXY_URL,
    pair
  })
  console.log(`Price ${pair}: ${price}`)
  let priceParseDecimalsToken = Number(parseUnits(price, decimalsToken)).toFixed(2)
  if(orderType == 2) {
    priceParseDecimalsToken = Number(parseUnits(price, decimalsToken) * 80n / 100n).toFixed(2)
  }
  const amount = Number(randomAmount({
    min: 2,
    max: 5
  }).toFixed(2))
  if (amount < 2 || Number(availableBalanceSize) < 2) {
    console.log(`Minimum order amount 2 ${coinName}! your balance: ${availableBalanceSize} ${coinName}, Open https://testnet.bitverse.zone/app/ to deposit or sync your account!`)
    return
  }
  const data = await getData({
    marginAmount: amount.toString(),
    pair,
    price: priceParseDecimalsToken,
    side,
    proxyUrl: PROXY_URL,
    orderType,
    address: signer.address
  })
  if (!data) {
    return
  }
  const { leverageE2, entryPrice, margin, longOI, shortOI, signTimestamp, sign, marketOpening } = data

  const iface = new Interface([
    "function func_0068(string,uint256,uint256,uint256,uint256,uint256,(address,uint256)[],uint256,uint256,uint256,uint256,uint256,bytes,uint256,uint256)",
  ]);
  const params = [
    pair,
    parseUnits(entryPrice, decimalsToken),
    orderType == 1 ? 1n : 0n, //order type 1n market, 0n limit
    BigInt(leverageE2),
    side == 1 ? 0n : 1n, //short 1n, long 0n
    100000n,
    [
      [
        contractAddress,
        parseUnits(margin[0].amount, decimalsToken)
      ]
    ],
    0n,
    0n,
    BigInt(longOI),
    BigInt(shortOI),
    BigInt(signTimestamp),
    sign,
    marketOpening ? 1n : 0n,
    1n
  ]
  const callData = iface.encodeFunctionData("func_0068", params);
  const selector = "0x12f10a18";
  const newCallData = selector + callData.slice(10)
  console.log(`Opening position ${side == 1 ? "long" : "short"} ${pair} for ${margin[0].amount} ${margin[0].denom}, Order type: ${orderType == 1 ? "market" : "limit"}...`)
  const tx = await signer.sendTransaction({
    to: router,
    data: newCallData,
    gasLimit: 5_000_000n
  })
  await tx.wait()
  success({ hash: tx.hash })
}