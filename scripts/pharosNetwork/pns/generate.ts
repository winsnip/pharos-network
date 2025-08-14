import { fetchWithProxyUndici } from "@scripts/utils/ip"

interface RandomUserParams {
     PROXY_URL: string
}

const headers = {
     "Origin": "https://randomuser.me/",
     "Accept": "*/*",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}

export async function randomUser({
     PROXY_URL = ""
}: RandomUserParams) {
     console.log("Generating random domain...")
     const url = "https://randomuser.me/api/?nat=us&randomapi"
     const response = await fetchWithProxyUndici({
          url,
          proxyUrl: PROXY_URL,
          method: "GET",
          headers
     })
     const json = JSON.parse(response.body)
     const { first, last } = json.results[0].name
     return { first, last }
}