import * as dotenv from "dotenv"
import { JsonRpcProvider, Wallet } from "ethers"
import path from "path"
import { assetUser } from "./assetUser"
import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { headers } from "./headers"
import { tokenBalance } from "@scripts/utils/balance"
import { sleep } from "@scripts/utils/time"
import { toUint256Hex } from "@scripts/utils/converter"
import { mockUSD } from "./contracts"
import { pharosTokenAddress } from "@scripts/lib/data"

interface Advisor {
     baseDir: string,
     wallet: Wallet,
     provider: JsonRpcProvider
}

const assetAddress = [pharosTokenAddress[0].address, pharosTokenAddress[1].address, mockUSD]

export async function advisor({
     baseDir,
     wallet,
     provider
}: Advisor) {
     dotenv.config({ path: path.join(baseDir, ".env") })
     const { PROXY_URL = "", AUTOSTAKING_TOKEN = "" } = process.env!
     const advisorUrl = "https://asia-east2-auto-staking.cloudfunctions.net/auto_staking_pharos_v6/investment/financial-portfolio-recommendation"
     const asset = await assetUser({
          PROXY_URL,
          AUTOSTAKING_TOKEN,
          walletAddress: wallet.address
     })
     if(!asset) return asset
     const tokens: string[] = []
     const userAssets: object[] = []


     for (const asset of assetAddress) {
          const { balance: assetBalance, decimals: assetDecimals, symbol: assetSymbol, name: assetName } = await tokenBalance({
               address: wallet.address,
               provider,
               tokenAddress: asset
          })
          if (assetBalance == 0n) continue
          let tokenName: string

          if (assetName === "Mock USD") {
               tokenName = "MockUSD"
          } else if (assetName === "USD Coin") {
               tokenName = "USDC"
          } else if (assetName === "Tether USD") {
               tokenName = "USDT"
          } else {
               tokenName = assetSymbol // fallback to symbol or any default
          }

          tokens.push(tokenName)

          const uint256Hex = toUint256Hex(assetBalance)
          const assetsUsd = parseInt(assetBalance.toString(16), 16) / (10 ** Number(assetDecimals))
          const data = {
               address: asset,
               assets: `${uint256Hex}`,
               assetsUsd,
               chain: { id: 688688 },
               decimals: Number(assetDecimals),
               name: tokenName,
               price: 1,
               symbol: tokenName
          }
          userAssets.push(data)
     }

     const payload = {
          chainIds: [688688],
          env: "pharos",
          profile: `1. Mandatory Requirement: The product's TVL must be higher than one million USD.
2. Balance Preference: Prioritize products that have a good balance of high current APY and high TVL.
3. Portfolio Allocation: Select the 3 products with the best combined ranking in terms of current APY and TVL among those with TVL > 1,000,000 USD. To determine the combined ranking, rank all eligible products by current APY (highest to lowest) and by TVL (highest to lowest), then sum the two ranks for each product. Choose the 3 products with the smallest sum of ranks. Allocate the investment equally among these 3 products, with each receiving approximately 33.3% of the investment.`,
          protocols: ["MockVault"],
          tokens: tokens.length != 0 ? tokens : ["USDC", "USDT", "MockUSD"],
          user: wallet.address,
          userAssets,
          userPositions: asset?.data.positions ?? []
     }

     await sleep(10000)

     console.log("Fetching advisor...")
     const resAdvisor = await fetchWithProxyUndici({
          url: advisorUrl,
          proxyUrl: PROXY_URL,
          method: "POST",
          headers: {
               ...headers,
               "Content-Type": "application/json",
               "Authorization": AUTOSTAKING_TOKEN
          },
          body: JSON.stringify(payload)
     })
     if(resAdvisor.status != 201) {
          console.log(resAdvisor.body)
          return false
     }
     return {
          data: JSON.parse(resAdvisor.body)
     }
}