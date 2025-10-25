import { rpcList } from "@scripts/lib/data"
import { setupProvider } from "@scripts/utils/provider"
import { ownAddress } from "@scripts/utils/wallet"
import path from "path"

export const baseDir = path.resolve(__dirname, "../")
export const provider = setupProvider({
     rpcUrl: rpcList.atlantic_pharos_testnet
})

export const wallet = ownAddress({
     dirname: baseDir,
     provider,
     key: "PRIVATE_KEY"
})