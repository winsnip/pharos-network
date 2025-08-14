import fs from "fs"
import { failed } from "@scripts/utils/console"
import { fetchWithProxyUndici } from "@scripts/utils/ip"
import * as dotenv from "dotenv"
import path from "path"
import { getAccessToken } from "./accessToken"
import { Wallet } from "ethers"
import { updateEnvContent } from "@scripts/utils/env"


interface SignatureParams {
     nftType: number,
     signer: Wallet,
     baseDir: string
}

const headers = {
     "Accept": "application/json, text/plain, */*",
     "Origin": "https://playground.aquaflux.pro",
     "Referer": "https://playground.aquaflux.pro/",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}

export async function getSignature({
     nftType,
     signer,
     baseDir
}: SignatureParams) {
     dotenv.config({ path: path.join(baseDir, ".env") })
     let { PROXY_URL, AQUAFLUX_ACCESS_TOKEN } = process.env!
     const url = "https://api.aquaflux.pro/api/v1/users/get-signature"
     try {
          if (!AQUAFLUX_ACCESS_TOKEN) {
               console.log("Creating access token...")
               const accesToken = await getAccessToken({
                    signer,
                    proxyUrl: PROXY_URL,
                    headers
               })
               AQUAFLUX_ACCESS_TOKEN = accesToken.data.accessToken
               const envPath = path.join(baseDir, ".env")
               const key = "AQUAFLUX_ACCESS_TOKEN"
               const existingEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : ""

               const updatedEnv = updateEnvContent({
                    envContent: existingEnv,
                    key,
                    value: AQUAFLUX_ACCESS_TOKEN!
               })
               fs.writeFileSync(envPath, updatedEnv)
               console.log(`✅ ${key} saved to ${envPath}`)

          }else{
               console.log("Access token already exist!")
          }
          const isHolding = await fetchWithProxyUndici({
               url: "https://api.aquaflux.pro/api/v1/users/check-token-holding",
               proxyUrl: PROXY_URL,
               method: "POST",
               headers: {
                         ...headers,
                         "Authorization": `Bearer ${AQUAFLUX_ACCESS_TOKEN}`,
                         "Content-Type": "application/json"
                    },
          })
          const jsonIsHolding = JSON.parse(isHolding.body)
          if(jsonIsHolding.data.isHoldingToken){
               const res = await fetchWithProxyUndici({
                    url,
                    proxyUrl: PROXY_URL,
                    method: "POST",
                    headers: {
                         ...headers,
                         "Authorization": `Bearer ${AQUAFLUX_ACCESS_TOKEN}`,
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         requestedNftType: nftType,
                         walletAddress: signer.address
                    })
               })
               const json = JSON.parse(res.body)
               return json.data
          }
     } catch (error) {
          failed({ errorMessage: error })
          return
     }
}