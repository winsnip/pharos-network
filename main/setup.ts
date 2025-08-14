import * as dotenv from "dotenv"
import { rpcList } from "@scripts/lib/data"
import { setupProvider } from "@scripts/utils/provider"
import { ownAddress } from "@scripts/utils/wallet"
import path from "path"

const baseDir = path.resolve(__dirname, ".")
dotenv.config({path: path.resolve(__dirname, ".env")})
const { AMOUNT_IN_PERCENT, TIMEOUT_MIN_MS, TIMEOUT_MAX_MS, RPC_URL } = process.env

export const provider = setupProvider({
     rpcUrl: RPC_URL ?? rpcList.pharos_official
})

export const wallet = ownAddress({
     dirname: baseDir,
     provider,
     key: "PRIVATE_KEY"
})

export function envLoaded(){
     return { 
          AMOUNT_IN_PERCENT: Number(AMOUNT_IN_PERCENT), 
          TIMEOUT_MIN_MS: Number(TIMEOUT_MIN_MS), 
          TIMEOUT_MAX_MS: Number(TIMEOUT_MAX_MS) }
}