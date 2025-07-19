import { Contract, InterfaceAbi, Wallet } from "ethers"
import ERC20ABI from "@scripts/lib/ERC20.json"

interface ApproveParams {
     tokenAddress: string,
     ERC20ABI: InterfaceAbi,
     signer: Wallet,
     router: string,
     amount: BigInt
}

export async function approve({
     tokenAddress,
     signer,
     router,
     amount
}:ApproveParams) {
     const contract = new Contract(tokenAddress, ERC20ABI, signer)
     console.log("Checking allowance...")
     const allowance = await contract.allowance(signer.address, router)
     console.log(allowance.toString())
     if (allowance < amount) {
          if (allowance > 0n) {
               console.log("Resetting allowance to 0 first...")
               const resetTx = await contract.approve(router, 0n)
               await resetTx.wait()
               console.log(`Reset tx: ${resetTx.hash}`)
          }

          console.log("Approving new amount to router...")
          const approveTx = await contract.approve(router, amount)
          await approveTx.wait()
          console.log(`Approve tx: ${approveTx.hash}`)
     } else {
          console.log("Sufficient allowance already approved.")
     }

}