import * as dotenv from "dotenv"
import path from "path"
import { commit } from "./commit"
import { Contract, JsonRpcProvider, Wallet } from "ethers"
import { abiPNS, resolverAddress, router } from "./data"
import { success } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"

interface RegisterPns {
     baseDir: string,
     signer: Wallet,
     days: number,
     provider: JsonRpcProvider
}

export async function register({
     baseDir,
     signer,
     days,
     provider
}: RegisterPns) {
     dotenv.config({ path: path.join(baseDir, ".env") })
     const { PROXY_URL = "" } = process.env!
     const committing = await commit({
          PROXY_URL,
          signer,
          days,
          provider
     })
     if (!committing.isCommitted) {
          console.log(committing.messages)
          return
     }
     const { price, name, duration, secret, encodedData } = committing
     console.log("Waiting for register!")
     await sleep(70000)
     const contract = new Contract(router, abiPNS, signer)
     console.log("Registering...")
     const register = await contract.register(
          name,
          signer.address,
          duration,
          secret,
          resolverAddress,
          [encodedData],
          false,
          0n,
          {
               value: price
          }
     )
     await register.wait()
     success({ hash: register.hash })
}