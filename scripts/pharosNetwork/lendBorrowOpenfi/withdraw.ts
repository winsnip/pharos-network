import { tokenBalance } from "@scripts/utils/balance"
import { Contract, formatUnits, JsonRpcProvider, Wallet } from "ethers"
import { openFiAbi, aOpenFiAssets } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"

interface WithdrawParams {
     signer: Wallet,
     tokenAddress: string,
     amountInPercent: number,
     provider: JsonRpcProvider
}

const router = "0x11d1ca4012d94846962bca2fbd58e5a27ddcbfc5"

export async function withdraw({
     signer,
     tokenAddress,
     amountInPercent,
     provider
}:WithdrawParams) {
     const {symbol: symbolToken, decimals: decimalsToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress
     })
     const aTokenAddress = aOpenFiAssets.filter(item => item.name.includes(symbolToken))[0].address
     const {balance: aBalanceToken, symbol: aSymbolToken} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: aTokenAddress
     })
     const amount = aBalanceToken * BigInt(amountInPercent) / 100n
     if(aBalanceToken < amount || aBalanceToken == 0n){
          console.log(`Insufficient Witdrawl amount of ${aSymbolToken}`)
          return
     }
     console.log(`Withdrawing ${formatUnits(amount,Number(decimalsToken))} ${symbolToken}...`)
     const contractRouter = new Contract(router, openFiAbi, signer)
     const tx = await contractRouter.withdraw(tokenAddress, amount, signer.address)
     await tx.wait()
     success({hash: tx.hash})
}