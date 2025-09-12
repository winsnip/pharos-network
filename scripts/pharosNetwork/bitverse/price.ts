import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { headers } from "./headers"

interface PriceParams {
     proxyUrl: string,
     pair: string
}

export async function getPrice({
     proxyUrl,
     pair
}:PriceParams) {
     const url = `https://api.bitverse.zone/bitverse/quote-all-in-one/v1/public/market/ticker?symbol=${pair}`

     const response = await fetchWithProxyUndici({
          url,
          proxyUrl,
          method: "GET",
          headers: {
               ...headers,
               "chain-id": "688688",
               "tenant-id": "PHAROS"
          }
     })
     if(response.status != 200){
          console.log(`Error, status code: ${response.status}`)
          return
     }
     const json = JSON.parse(response.body)
     const price = json.result.lastPrice
     return price
}