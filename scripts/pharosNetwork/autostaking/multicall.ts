import { Contract, parseEther, Wallet } from "ethers"
import { VaultMulticall_v2Abi } from "@scripts/lib/data"

interface MulticallParams {
     wallet: Wallet,
     encodedArguments: string[],
     router: string
}

export async function multicall({
     wallet,
     encodedArguments,
     router
}: MulticallParams) {
     const routerContract = new Contract(router, VaultMulticall_v2Abi, wallet)
     const tx = await routerContract.multicall(encodedArguments, {
          value: parseEther("0")
     })
     await tx.wait()
     console.log(`success! txhash: ${tx.hash}`)
}