import { bitverseAbi } from "@scripts/lib/data"
import { approve } from "@scripts/utils/approve"
import { tokenBalance } from "@scripts/utils/balance"
import { success } from "@scripts/utils/console"
import { Contract, formatUnits, JsonRpcProvider, Wallet } from "ethers"

interface DepositParams {
     signer: Wallet,
     provider: JsonRpcProvider,
     router: string,
     tokenAddress: string,
     amountInPercent: number
}

export async function deposit({
     signer,
     provider,
     router,
     tokenAddress,
     amountInPercent
}:DepositParams) {
     const {balance: balanceToken, symbol: symbolToken, decimals: decimalsToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress
     })
     const amount = balanceToken * BigInt(amountInPercent) / 100n
     await approve({
          tokenAddress,
          signer,
          router,
          amount
     })
     console.log(`Depositing ${formatUnits(amount, Number(decimalsToken))} ${symbolToken}`)
     const contractRouter = new Contract(router, bitverseAbi, signer)
     const tx = await contractRouter.deposit(tokenAddress, amount)
     await tx.wait()
     success({hash: tx.hash})
}