import poolAddresses from "./poolAddress.json"
import tokenAddreses from "./tokenAddress.json"
import { multicalLiquidity } from "./multicalLiquidity"

export async function lpUSDC() {
     const poolAddressUsdcUsdt = poolAddresses.filter(item => item.pair == "USDC/USDT")[0].address
     const usdcAddress = tokenAddreses.filter(item => item.name == "USDC")[0].address
     const usdtAddress = tokenAddreses.filter(item => item.name == "USDT")[0].address

     try {
          console.log("Liquidity USDC/USDT")
          await multicalLiquidity({
               poolAddress: poolAddressUsdcUsdt,
               tokenA: usdcAddress,
               tokenB: usdtAddress
          })
     } catch (error) {
          console.error(error)
     }

     const poolAddressUsdcPhrs = poolAddresses.filter(item => item.pair == "USDC/PHRS")[0].address
     const wphrsAddress = tokenAddreses.filter(item => item.name == "WPHRS")[0].address

      try {
          console.log("Liquidity USDC/PHRs")
          await multicalLiquidity({
               poolAddress: poolAddressUsdcPhrs,
               tokenA: usdcAddress,
               tokenB: wphrsAddress
          })
     } catch (error) {
          console.error(error)
     }
}

