import { Wallet } from "ethers"
import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { failed } from "@scripts/utils/console"
import { getFutureTimestamp } from "@scripts/utils/date"

interface AccessParams {
     signer: Wallet,
     proxyUrl: string | undefined,
     headers: Record<string, string>
}
export async function getAccessToken({
     signer,
     proxyUrl,
     headers
}:AccessParams){
     const url = "https://api.aquaflux.pro/api/v1/users/wallet-login"
     try {
          const timestamp = getFutureTimestamp({hours: 0, days: 0})
          const message = `Sign in to AquaFlux with timestamp: ${timestamp}`
          const signMessage = await signer.signMessage(message)
          const res = await fetchWithProxyUndici({
               url,
               proxyUrl,
               method: "POST",
               headers: {
                    ...headers,
                    "Content-Type": "application/json"
               },
               body: JSON.stringify({
                    address: signer.address,
                    message,
                    signature: signMessage
               })
          })
          const data = JSON.parse(res.body)
          return data
     } catch (error) {
          failed({errorMessage: error})
     }
}