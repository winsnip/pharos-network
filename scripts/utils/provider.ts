import { JsonRpcProvider } from "ethers"

interface Provider {
     rpcUrl: string,
}

export function setupProvider({
     rpcUrl
}:Provider) {
     const provider = new JsonRpcProvider(rpcUrl)
     return provider
}
