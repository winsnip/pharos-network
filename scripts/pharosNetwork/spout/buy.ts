import { approve } from "@scripts/utils/approve";
import { tokenBalance } from "@scripts/utils/balance";
import { success } from "@scripts/utils/console";
import { formatUnits, JsonRpcProvider, toBeHex, Wallet, zeroPadValue } from "ethers";

interface BuyParams {
     tokenIn: string,
     tokenOut: string,
     router: string,
     amountInPercent: number,
     signer: Wallet,
     provider: JsonRpcProvider
}

export async function buy({
     tokenIn,
     tokenOut,
     router,
     amountInPercent,
     signer,
     provider
}: BuyParams){
     const {balance: tokenInBalance, decimals: tokenInDecimals, symbol: tokenInSymbol} = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: tokenIn
     })
     const amount = tokenInBalance * BigInt(amountInPercent) / 100n
     if(tokenInBalance < amount || tokenInBalance == 0n){
          console.log(`Insufficient ${tokenInSymbol} balance`)
          return
     }
     await approve({
          tokenAddress: tokenIn,
          signer,
          router,
          amount
     })
     const symbolTokenTraded = "LQD"
     const selector = "0x28274b63"
     const staticOffsetPadded = zeroPadValue(toBeHex(2000002n), 32)
     const pointerOffset128Padded = zeroPadValue(toBeHex(128n), 32)
     const tokenOutPadded = zeroPadValue(tokenOut, 32)
     const amountpadded = zeroPadValue(toBeHex(amount), 32)
     const symbolTokenLengthPadded = zeroPadValue(toBeHex(symbolTokenTraded.length), 32)
     const symbolTokenToHex = Buffer.from(symbolTokenTraded, "utf-8").toString("hex")
     const zeroPaddedEnd = symbolTokenToHex.padEnd(64, "0")

     const callData = selector + staticOffsetPadded.slice(2) + pointerOffset128Padded.slice(2) + tokenOutPadded.slice(2) + amountpadded.slice(2) + symbolTokenLengthPadded.slice(2) + symbolTokenToHex.slice(2) + zeroPaddedEnd.slice(2)

     console.log(`AmountIn ${formatUnits(amount,tokenInDecimals)} ${tokenInSymbol},  Buying S${symbolTokenTraded}...`)
     const tx = await signer.sendTransaction({
          to: router,
          data: callData
     })
     await tx.wait()
     success({hash: tx.hash})
}