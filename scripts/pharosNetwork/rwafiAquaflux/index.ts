import { Contract, Wallet } from "ethers"
import { claimTokens } from "./claimTokens"
import { craftTokens } from "./craftTokens"
import { abiAquaflux, router } from "./data"
import { getSignature } from "./signature"
import { failed, success } from "@scripts/utils/console"

interface MintParams {
     signer: Wallet,
     baseDir: string,
     selector: string
}

export async function mint({
     signer,
     baseDir,
     selector
}:MintParams) {
     const contract = new Contract(router, abiAquaflux, signer)
     try {
          console.log("Claiming token...")
          await claimTokens({
               signer,
               router,
               abi: abiAquaflux
          })
          console.log(`Crafting token to ${selector}...`)
          await craftTokens({
               signer,
               router,
               selector
          })
          console.log("Creating signature...")
          const {expiresAt, nftType, signature} = await getSignature({
               nftType: 0,
               signer,
               baseDir
          })
          if(!expiresAt) {
               failed({errorMessage: "Error creating signature!"})
          }
          console.log("Minting nft...")
          const tx = await contract.mint(BigInt(nftType), BigInt(expiresAt), signature)
          await tx.wait()
          success({hash: tx.hash})
     } catch (error) {
          failed({errorMessage: error})
     }
}