import { Interface, Wallet } from "ethers"
import { approve } from "@scripts/utils/approve"
import { VaultMulticall_v2Abi } from "@scripts/lib/data"

interface MulticallParams {
     wallet: Wallet,
     vaultAddress: string,
     router: string,
     amount: bigint
}

export async function withdrawFromVault({
     wallet,
     vaultAddress,
     router,
     amount
}: MulticallParams) {
     const iface = new Interface(VaultMulticall_v2Abi)
     await approve({
          tokenAddress: vaultAddress,
          signer: wallet,
          router,
          amount
     })
     const encodedWithdraw = iface.encodeFunctionData("withdrawFromVault", [
          vaultAddress,
          amount,
          wallet.address,
          wallet.address
     ])
     return encodedWithdraw
}