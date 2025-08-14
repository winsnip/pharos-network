import { fetchWithProxyUndici } from "@scripts/utils/ip"
import { Contract, JsonRpcProvider, namehash } from "ethers"
import { resolverAddress } from "./data"

interface Checker {
     PROXY_URL: string,
     domain: string
}

const headers = {
     "Origin": "https://test.pharosname.com/",
     "Referer": "https://test.pharosname.com/",
     "Content-Type": "application/json",
     "Accept": "*/*",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}

const payloadSubgraphRecords = {
     "query": "query getSubgraphRecords($id: String!) {\n  domain(id: $id) {\n    name\n    isMigrated\n    createdAt\n    resolver {\n      texts\n      coinTypes\n    }\n    id\n  }\n}", "operationName": "getSubgraphRecords"
}

const payloadResolverExists = { 
     "query": "query getResolverExists($id: String!) {\n  resolver(id: $id) {\n    id\n  }\n}","operationName": "getResolverExists"
}

export async function isAvailable({
     PROXY_URL = "",
     domain
}: Checker) {
     const id = namehash(domain)
     const url = "https://graphql.pharosname.com/"
     const response = await fetchWithProxyUndici({
          url,
          proxyUrl: PROXY_URL,
          method: "POST",
          headers,
          body: JSON.stringify({
               ...payloadSubgraphRecords,
               variables: { id }
          })
     })
     const json = JSON.parse(response.body)
     if(json.data.domain == null){
          const responseIsResolverExist = await fetchWithProxyUndici({
                    url,
                    proxyUrl: PROXY_URL,
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                         ...payloadResolverExists,
                    variables: { id: `${resolverAddress}-${id}` }
               })
          })
          const json = JSON.parse(responseIsResolverExist.body)
          return json.data.resolver == null
     }
     return false
}

interface Price {
     provider: JsonRpcProvider,
     router: string,
     abi: string[],
     name: string,
     duration: number
}

export async function priceDomain({
     provider,
     router,
     abi,
     name,
     duration
}: Price) {
     const contract = new Contract(router, abi, provider)
     const price = await contract.rentPrice(name, duration)
     return price
}