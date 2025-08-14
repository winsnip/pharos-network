import { Interface, Wallet } from "ethers"
import { approve } from "@scripts/utils/approve"
import { VaultMulticall_v2Abi } from "@scripts/lib/data"

interface MulticallParams {
     wallet: Wallet,
     vaultAddress: string,
     router: string,
     tokenAddress: string,
     amount: BigInt
}

export async function depositToVault({
     wallet,
     vaultAddress,
     tokenAddress,
     amount,
     router
}: MulticallParams) {
     const iface = new Interface(VaultMulticall_v2Abi)
     await approve({
          tokenAddress,
          signer: wallet,
          router,
          amount
     })
     const encodedDeposit = iface.encodeFunctionData("depositToVault", [
          vaultAddress,
          amount,
          wallet.address
     ])
     return encodedDeposit
}