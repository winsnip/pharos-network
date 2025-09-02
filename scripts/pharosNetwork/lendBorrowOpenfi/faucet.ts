import { openFiAbi } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"
import { sleep } from "@scripts/utils/time"
import { Contract, parseEther, Wallet } from "ethers"

interface FaucetParams {
     signer: Wallet,
}

const router = "0x0e29d74af0489f4b08fbfc774e25c0d3b5f43285"

export async function faucet({
     signer
}: FaucetParams) {
     const tokens = [
          {
               "name": "TSLA_OPENFI",
               "address": "0xa778b48339d3c6b4bc5a75b37c6ce210797076b1"
          },
          {
               "name": "GOLD_OPENFI",
               "address": "0xaaf03cbb486201099edd0a52e03def18cd0c7354"
          },
          {
               "name": "NVIDIA_OPENFI",
               "address": "0xaaf3a7f1676385883593d7ea7ea4fccc675ee5d6"
          }
     ]
     const contractRouter = new Contract(router, openFiAbi, signer)
     const amount = parseEther("100")
     for(const token of tokens){
          console.log(`Minting ${token.name}`)
          const tx = await contractRouter.mint(token.address, signer.address, amount)
          await tx.wait()
          success({hash: tx.hash})
          await sleep(15000)
     }
}