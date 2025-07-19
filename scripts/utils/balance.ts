import { ethers, JsonRpcProvider } from "ethers"
import ERC20ABI from "@scripts/lib/ERC20.json"

interface Balance {
     address: string,
     provider: JsonRpcProvider
}
export async function coinBalance({
     address,
     provider
}:Balance) {
     const coinBalance = await provider.getBalance(address)
     return ethers.formatEther(coinBalance)
}

interface Token extends Balance {
     tokenAddress: string
}

export async function tokenBalance({
     address,
     provider,
     tokenAddress
}:Token) {
     const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider)
     const [name, decimals, symbol, balance] = await Promise.all([
          contract.name(), contract.decimals(), contract.symbol(), contract.balanceOf(address)
     ])
     return {
          name, decimals, symbol, balance
     }
}