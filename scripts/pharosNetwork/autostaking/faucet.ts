import { Contract, Wallet } from "ethers";

interface Faucet {
     signer: Wallet
}

const routerAddress = "0xf1cf5d79be4682d50f7a60a047eaca9bd351ff8e"
const routerAbi = [
     "function claimFaucet()"
]
export async function faucet({
     signer
}: Faucet) {
     const router = new Contract(routerAddress, routerAbi, signer)
     console.log("claiming faucet...")
     const tx = await router.claimFaucet()
     await tx.wait()
     console.log(`succes! txhash: ${tx.hash}`)
}