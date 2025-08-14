import { wallet, provider } from "../setup"
import path from "path"
import { multicall } from "@scripts/pharosNetwork/autostaking/multicall"
import { advisor } from "@scripts/pharosNetwork/autostaking/advisor"
import { depositToVault } from "@scripts/pharosNetwork/autostaking/deposit"
import { tokenBalance } from "@scripts/utils/balance"
import { withdrawFromVault } from "@scripts/pharosNetwork/autostaking/withdraw"
import { envLoaded } from "../setup"
import { randomAmount } from "@scripts/utils/amount"
import { sleep } from "@scripts/utils/time"

const baseDir = path.resolve(__dirname, "../")

const router = "0x11cd3700b310339003641fdce57c1f9bd21ae015"

interface VaultEntry {
     decimals: number;
     vaults: {
          vaultAddress: string;
          assetAddress: string;
          amount: bigint;
          type: string;
     }[]
}

async function main() {
     const env = envLoaded()
     for (let index = 1; index <= env.LOOP_COUNT; index++){
          console.log(`Task autostaking deposit AI recomendation ${index}/${env.LOOP_COUNT}`)
          try {
               const response = await advisor({
                    baseDir,
                    wallet: wallet.signer,
                    provider
               })
               if(!response){
                    console.log("Error fetch or access token not found!")
                    return
               }
               const encodedArguments: string[] = []
               const changes = response?.data.data.changes
               const groupedByToken: Record<string, VaultEntry> = {};
     
               for (const change of changes) {
                    const tokenAddress = change.token.address.toLowerCase();
     
                    if (!groupedByToken[tokenAddress]) {
                         groupedByToken[tokenAddress] = {
                              decimals: change.token.decimals,
                              vaults: []
                         };
                    }
     
                    groupedByToken[tokenAddress].vaults.push({
                         type: change.type,
                         vaultAddress: change.product.address,
                         assetAddress: change.product.asset.address,
                         amount: BigInt(change.token.amount)
                    });
               }
     
               for (const [tokenAddress, { vaults, decimals }] of Object.entries(groupedByToken)) {
                    const { balance: tokenBalanceAmount } = await tokenBalance({
                         address: wallet.address,
                         provider,
                         tokenAddress
                    });
     
                    const totalWeight = vaults.reduce((sum, v) => sum + v.amount, 0n);
     
                    for (const v of vaults) {
                         const proportion = Number(v.amount) / Number(totalWeight);
                         const allocatedAmount = BigInt(Math.floor(Number(tokenBalanceAmount) * proportion));
                         let encoded: string | undefined;
                         if (v.type === "deposit") {
                              encoded = await depositToVault({
                                   wallet: wallet.signer,
                                   vaultAddress: v.vaultAddress,
                                   tokenAddress,
                                   amount: allocatedAmount,
                                   router
                              });
                         } else {
                              encoded = await withdrawFromVault({
                                   wallet: wallet.signer,
                                   vaultAddress: v.vaultAddress,
                                   router,
                                   amount: allocatedAmount
                              })
                         }
                         encodedArguments.push(encoded!);
                    }
               }
               console.log(`Selected Tokens: `)
               console.dir(groupedByToken, { depth: null })
               console.log("Depositing...")
               await multicall({
                    wallet: wallet.signer,
                    encodedArguments,
                    router
               })
          } catch (error) {
               console.error(error)
               return
          }
     
          const ms = randomAmount({
               min: env.TIMEOUT_MIN_MS,
               max: env.TIMEOUT_MAX_MS
          })
          await sleep(ms)
     }

}
main().catch(console.error)