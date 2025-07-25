import { wallet, provider, envLoaded } from "../setup"
import { pharosTokenAddress } from "@scripts/lib/data"
import { swap } from "@scripts/pharosNetwork/faroswap/swap"
import { randomAmount } from "@scripts/utils/amount"
import { sleep } from "@scripts/utils/time"
import path from "path"

const baseDir = path.resolve(__dirname, "../")

export default async function wphrsSwapFaros() {
     const env = envLoaded()
     const usdcAddress = pharosTokenAddress.filter(item => item.name == "USDC")[0].address
     const usdtAddress = pharosTokenAddress.filter(item => item.name == "USDT")[0].address
     const wphrsAddress = pharosTokenAddress.filter(item => item.name == "WPHRS_FAROSWAP")[0].address
     
     let deadline = Math.floor(Date.now() / 1000) + 60 * 10
     const slippageUrl = "31.201"
     await swap({
          tokenIn: wphrsAddress,
          tokenOut: usdcAddress,
          deadline,
          signer: wallet.signer,
          amountIn_inPercent: env.AMOUNT_IN_PERCENT,
          provider,
          dirname: baseDir,
          slippageUrl
     })

     let ms = randomAmount({
          min: env.TIMEOUT_MIN_MS,
          max: env.TIMEOUT_MAX_MS
     })
     await sleep(ms)

     deadline = Math.floor(Date.now() / 1000) + 60 * 20
     await swap({
          tokenIn: wphrsAddress,
          tokenOut: usdtAddress,
          deadline,
          signer: wallet.signer,
          amountIn_inPercent: env.AMOUNT_IN_PERCENT,
          provider,
          dirname: baseDir,
          slippageUrl
     })
}