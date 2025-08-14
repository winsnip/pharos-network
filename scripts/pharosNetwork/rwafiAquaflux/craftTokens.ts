import { failed, success } from "@scripts/utils/console"
import { parseUnits, toBeHex, Wallet, zeroPadValue } from "ethers"

interface CraftParams {
     signer: Wallet,
     router: string,
     selector: string
}

export async function craftTokens({
     signer,
     router,
     selector
}:CraftParams) {
     const amount = parseUnits("100", 18)
     const padded = zeroPadValue(toBeHex(amount), 32)
     const callData = selector + padded.slice(2)
     try {
          const tx = await signer.sendTransaction({
               to: router,
               data: callData
          })
          await tx.wait()
          success({hash: tx.hash})
     } catch (error) {
          failed({errorMessage: error})
          return
     }
}