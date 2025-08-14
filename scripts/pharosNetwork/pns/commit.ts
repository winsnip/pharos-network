import { isAvailable, priceDomain } from "./check"
import { randomUser } from "./generate"
import { Contract, formatEther, JsonRpcProvider, keccak256, namehash, randomBytes, Wallet } from "ethers"
import { router, abiPNS, resolverAbi } from "./data"
import { sleep } from "@scripts/utils/time"
import { success } from "@scripts/utils/console"
import { coinBalance } from "@scripts/utils/balance"
import { resolverAddress } from "./data"
import { Interface } from "ethers"

interface CommitParams {
     PROXY_URL: string,
     signer: Wallet,
     days: number,
     provider: JsonRpcProvider
}
interface ReturnCommit {
     isCommitted: boolean,
     commitment?: string,
     price?: bigint,
     name?: string,
     duration?: bigint,
     secret?: string,
     messages?: string,
     domain?: string,
     encodedData?: string
}

export async function commit({
     PROXY_URL,
     signer,
     days,
     provider
}: CommitParams): Promise<ReturnCommit> {
     let domain: string = ""
     let is_Available: boolean = false
     while (!is_Available) {
          const { first, last } = await randomUser({
               PROXY_URL
          })
          domain = `${first}${last}.phrs`.toLowerCase()
          is_Available = await isAvailable({
               domain,
               PROXY_URL
          })
          if (!is_Available) {
               console.log(`${domain} not available, waiting for regenerate!`)
               await sleep(5000)
          }
     }

     let commitment: string = ""
     const owner = signer.address
     const secret = keccak256(randomBytes(32))
     const label = domain.split(".")[0]
     const durationInseconds = days * 24 * 60 * 60

     const resolverIface = new Interface(resolverAbi)
     const coinType = BigInt(2148172336)
     const node = namehash(domain)

     const encodedData = resolverIface.encodeFunctionData("setAddr", [
          node,
          coinType,
          signer.address
     ])
     console.log(`Selected domain: ${domain}`)

     const price = await priceDomain({
          provider,
          router,
          abi: abiPNS,
          name: label,
          duration: durationInseconds
     })
     const coin_balance = await coinBalance({
          address: signer.address,
          provider
     })
     if (coin_balance > formatEther(price)) {
          console.log("Committing...")
          const contractCommit = new Contract(router, abiPNS, signer)
          commitment = await contractCommit.makeCommitment(
               label,
               owner,
               BigInt(durationInseconds),
               secret,
               resolverAddress,
               [encodedData],
               false,
               0
          )
          const tx = await contractCommit.commit(commitment)
          await tx.wait()
          success({ hash: tx.hash })
          return {
               isCommitted: true,
               commitment,
               price,
               name: label,
               duration: BigInt(durationInseconds),
               secret,
               domain,
               encodedData
          }
     } else {
          const messages = `Insufficient balance! Price: ${formatEther(price)}, Your balance: ${coin_balance}`
          return {
               isCommitted: false,
               messages
          }
     }
}