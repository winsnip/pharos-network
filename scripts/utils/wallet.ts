import * as dotenv from "dotenv"
import { JsonRpcProvider, Wallet } from "ethers"
import path from "path"

interface WalletParams {
     dirname: string
     provider: JsonRpcProvider,
     key: string
}

export function ownAddress({
     dirname,
     provider,
     key
}:WalletParams) {
     dotenv.config({path: path.join(dirname, ".env")})
     const privateKey = process.env[key]!
     if (!privateKey) {
          throw new Error(`Private key not found for env variable "${key}"`);
     }
     const wallet = new Wallet(privateKey,provider)
     return {
          address: wallet.address,
          signer: wallet
     }
}