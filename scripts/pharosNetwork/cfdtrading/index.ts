import * as dotenv from "dotenv"
import path from "path"
import getProof from "./proof"
import { Contract, formatUnits, JsonRpcProvider, Wallet } from "ethers"
import { CFDTradeAbi, pairs, router, spender, mockUSD, faucet } from "./data"
import { randomAmount } from "@scripts/utils/amount"
import { tokenBalance } from "@scripts/utils/balance"
import { approve } from "@scripts/utils/approve"
import { success } from "@scripts/utils/console"

interface OpenPositionParams {
     baseDir: string,
     signer: Wallet,
     provider: JsonRpcProvider
}

export async function OpenPosition({
     baseDir,
     signer,
     provider
}: OpenPositionParams) {
     dotenv.config({ path: path.join(baseDir, ".env") })
     const index = Math.floor(randomAmount({
          min: 0,
          max: pairs.length - 1
     }))
     const position = Math.random() < 0.5
     const selectedPair = pairs[index]
     const pair = BigInt(selectedPair.pair)
     const { PROXY_URL = "" } = process.env!

     const { balance: mockUsdcbalance, decimals: mockUsdcDecimals } = await tokenBalance({
          address: signer.address,
          provider,
          tokenAddress: mockUSD
     })
     const amount = BigInt(Math.floor(randomAmount({
          min: 10_000_000,
          max: 50_000_000
     })))
     if (mockUsdcbalance < amount) {
          console.log("Insufficient USDC balance!")
          console.log("Claiming faucet...")
          const faucetContract = new Contract(faucet, CFDTradeAbi, signer)
          const tx = await faucetContract.claim()
          await tx.wait()
          success({ hash: tx.hash })
     }
     await approve({
          tokenAddress: mockUSD,
          signer,
          router: spender,
          amount
     })
     const proof = await getProof({
          pair: selectedPair.pair,
          PROXY_URL
     })
     
     const contractRouter = new Contract(router, CFDTradeAbi, signer)
     console.log(`Opening Position ${formatUnits(amount, mockUsdcDecimals)} ${position == true ? "long" : "short"} ${selectedPair.name}...`)
     const tx = await contractRouter.openPosition(
          pair,
          proof,
          position,
          1n,
          amount,
          0n,
          0n
     )
     await tx.wait()
     success({ hash: tx.hash })
}