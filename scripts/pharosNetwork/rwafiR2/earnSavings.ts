import { tokenBalance } from "@scripts/utils/balance"
import { Contract, JsonRpcProvider, toBeHex, Wallet, zeroPadValue } from "ethers"
import { approve } from "@scripts/utils/approve"
import { r2Abi } from "@scripts/lib/data"
import { success } from "@scripts/utils/console"

interface SwapParams {
     tokenIn: string,
     tokenOut: string,
     router: string,
     signer: Wallet,
     provider: JsonRpcProvider,
     amountInPercent: number
}

export async function swap({
     tokenIn,
     tokenOut,
     router,
     signer,
     provider,
     amountInPercent
}: SwapParams) {
     const { balance: tokenInBalance, symbol: tokenInSymbol} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: tokenIn
     })
     const { symbol: tokenOutSymbol } = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: tokenOut
     })
     const amountIn = tokenInBalance * BigInt(amountInPercent) / 100n
     if (tokenInBalance < amountIn) {
          console.log(`Insufficient ${tokenInSymbol}`)
          return
     }
     if (tokenIn.toLowerCase() == router.toLowerCase()) {
          console.log(`Swapping ${tokenInSymbol}/${tokenOutSymbol}...`)
          const routerContract = new Contract(router, r2Abi, signer)
          const tx = await routerContract.burn(signer.address, amountIn)
          await tx.wait()
          success({ hash: tx.hash })
     } else {
          await approve({
               tokenAddress: tokenIn,
               signer,
               router,
               amount: amountIn
          })
          const selector = "0x1a5f0f00"
          const encodedZeroUint = zeroPadValue(toBeHex(0), 160);
          const paddedAmount = zeroPadValue(toBeHex(amountIn), 32)
          const callData = selector + paddedAmount.slice(2) + encodedZeroUint.slice(2)
          console.log(`Swapping ${tokenInSymbol}/${tokenOutSymbol}...`)
          const tx = await signer.sendTransaction({
               to: router,
               data: callData
          })
          await tx.wait()
          success({ hash: tx.hash })
     }
}