import { tokenBalance } from "@scripts/utils/balance"
import { Contract, formatEther, formatUnits, JsonRpcProvider, Wallet } from "ethers"
import { openFiAbi, openFiAssets } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"
import { approve } from "@scripts/utils/approve"

interface SupplayParams {
     signer: Wallet,
     tokenAddress: string,
     amountInPercent: number,
     provider: JsonRpcProvider
}

const router = "0x11d1ca4012d94846962bca2fbd58e5a27ddcbfc5"

export async function repay({
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
     const assetRepayedAddress = openFiAssets.filter(item => item.name.includes(symbolToken.replace("variableDebtPharos", "")))[0].address
     const {balance: assetRepayedBalance, symbol: assetRepayedSymbol, decimals: assetRepayedDecimals} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: assetRepayedAddress
     })
     if(assetRepayedBalance < amount || assetRepayedBalance == 0n){
          console.log(`Insufficient ${assetRepayedSymbol}`)
          return
     }
     await approve({
          tokenAddress: assetRepayedAddress,
          signer,
          router,
          amount
     })
     console.log(`Repaying ${formatUnits(amount, Number(assetRepayedDecimals))} ${assetRepayedSymbol}...`)
     const contractRouter = new Contract(router, openFiAbi, signer)
     const tx = await contractRouter.repay(assetRepayedAddress, amount, 2n, signer.address)
     await tx.wait()
     success({hash: tx.hash})
}