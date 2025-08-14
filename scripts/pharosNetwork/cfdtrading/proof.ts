import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { headers } from "./data"

interface ProofParams{
     pair: string,
     PROXY_URL: string
}
export default async function getProof({
     pair,
     PROXY_URL
}:ProofParams){
     console.log("Fetching proof...")
     const url = `https://proof.brokex.trade/proof?pairs=${pair}`
     const proof = await fetchWithProxyUndici({
          url,
          proxyUrl: PROXY_URL,
          method: "GET",
          headers,
     })
     const json = JSON.parse(proof.body)
     return json.proof
}