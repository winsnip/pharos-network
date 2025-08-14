import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { headers } from "./headers"

interface AssetUser {
     PROXY_URL: string,
     AUTOSTAKING_TOKEN: string,
     walletAddress: string
}


export async function assetUser({
     PROXY_URL,
     AUTOSTAKING_TOKEN,
     walletAddress
}: AssetUser) {
     console.log("Fetching user positions...")
     const assetUrl = `https://asia-east2-auto-staking.cloudfunctions.net/auto_staking_pharos_v4/user/positions?user=${walletAddress}&env=pharos`
     const res = await fetchWithProxyUndici({
          url: assetUrl,
          proxyUrl: PROXY_URL,
          method: "GET",
          headers: {
               ...headers,
               "Authorization": AUTOSTAKING_TOKEN
          }
     })
     if(res.status != 200) {
          console.log(res.body)
          return false
     }
     return {
          data: JSON.parse(res.body)
     }
}
