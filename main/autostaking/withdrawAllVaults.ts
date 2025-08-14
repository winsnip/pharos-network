import * as dotenv from "dotenv"
import path from "path"
import { assetUser } from "@scripts/pharosNetwork/autostaking/assetUser"
import { envLoaded, wallet } from "../setup"
import { withdrawFromVault } from "@scripts/pharosNetwork/autostaking/withdraw"
import { router } from "@scripts/pharosNetwork/autostaking/contracts"
import { multicall } from "@scripts/pharosNetwork/autostaking/multicall"
import { randomAmount } from "@scripts/utils/amount"
import { sleep } from "@scripts/utils/time"

interface Vaults {
     address: string,
     balance: bigint
}

async function main() {
     const env = envLoaded()
     dotenv.config({ path: path.join(__dirname, "../.env") })
     const { PROXY_URL = "", AUTOSTAKING_TOKEN = "" } = process.env!

     try {
          const asset = await assetUser({
               PROXY_URL,
               AUTOSTAKING_TOKEN,
               walletAddress: wallet.address
          })
          if(!asset) {
               console.log("Error Fetch")
               return
          }
          const positions = asset?.data.positions
          if(positions.length == 0){
               console.log("No positions on any vault")
               return
          }
          const vaults: Vaults[] = []
          for (const position of positions) {
               vaults.push({
                    address: position.assetAddress,
                    balance: BigInt(position.assetBalance)
               })
          }
          const encodedArguments: string[] = []
          for (const vault of vaults) {
               const data = await withdrawFromVault({
                    wallet: wallet.signer,
                    vaultAddress: vault.address,
                    router,
                    amount: vault.balance
               })
               if (data) encodedArguments.push(data)
          }
          console.log('Withdrawing...')
          await multicall({
               wallet: wallet.signer,
               encodedArguments,
               router
          })
     } catch (error) {
          console.error
     }

     const ms = randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     })
     await sleep(ms)

}
main().catch(console.error)