import { tokenBalance } from "@scripts/utils/balance"
import { Contract, formatUnits, JsonRpcProvider, Wallet } from "ethers"
import { openFiAbi, aOpenFiAssets } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"

interface BorrowParams {
     signer: Wallet,
     tokenAddress: string,
     amountInPercent: number,
     provider: JsonRpcProvider
}

const router = "0x11d1ca4012d94846962bca2fbd58e5a27ddcbfc5"

export async function borrow({
     signer,
     tokenAddress,
     amountInPercent,
     provider
}:BorrowParams) {
     const {symbol: symbolToken, decimals: decimalsToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress
     })
     const aTokenAddress = aOpenFiAssets.filter(item => item.name.includes(symbolToken))[0].address
     const {balance: aBalanceToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: aTokenAddress
     })
     const amount = aBalanceToken * BigInt(amountInPercent) / 100n
     if(aBalanceToken < amount || aBalanceToken == 0n){
          console.log(`Insufficient Borrowable amount of ${symbolToken}`)
          return
     }
     console.log(`Borrowing ${formatUnits(amount,Number(decimalsToken))} ${symbolToken}...`)
     const contractRouter = new Contract(router, openFiAbi, signer)
     const tx = await contractRouter.borrow(tokenAddress, amount, 2n, 0n, signer.address)
     await tx.wait()
     success({hash: tx.hash})
}