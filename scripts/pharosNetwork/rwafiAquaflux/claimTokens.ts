import { failed, success } from "@scripts/utils/console"
import { Contract, Wallet } from "ethers"


interface ClaimParams {
     signer: Wallet,
     router: string,
     abi: string[],
}

export async function claimTokens({
     signer,
     router,
     abi
}:ClaimParams) {
     const contract = new Contract(router, abi, signer)
     try {
          const tx = await contract.claimTokens()
          await tx.wait()
          success({hash: tx.hash})
     } catch (error) {
          failed({errorMessage: error})
          return
     }
}