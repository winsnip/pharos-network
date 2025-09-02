import { tokenBalance } from "@scripts/utils/balance"
import { Contract, JsonRpcProvider, Wallet } from "ethers"
import { openFiAbi } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"
import { approve } from "@scripts/utils/approve"

interface SupplayParams {
     signer: Wallet,
     tokenAddress: string,
     amountInPercent: number,
     provider: JsonRpcProvider
}

const router = "0x11d1ca4012d94846962bca2fbd58e5a27ddcbfc5"

export async function supply({
     signer,
     tokenAddress,
     amountInPercent,
     provider
}:SupplayParams) {
     const {balance: balanceToken, symbol: symbolToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress
     })
     const amount = balanceToken * BigInt(amountInPercent) / 100n
     if(balanceToken < amount || balanceToken == 0n){
          console.log(`Insufficient ${symbolToken}`)
          return
     }
     await approve({
          tokenAddress,
          signer,
          router,
          amount
     })
     console.log(`Supplying ${symbolToken}...`)
     const contractRouter = new Contract(router, openFiAbi, signer)
     const tx = await contractRouter.supply(tokenAddress, amount, signer.address, 0n)
     await tx.wait()
     success({hash: tx.hash})
}