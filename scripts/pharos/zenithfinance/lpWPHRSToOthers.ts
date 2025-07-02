import poolAddresses from "./poolAddress.json"
import tokenAddreses from "./tokenAddress.json"
import { multicalLiquidity } from "./multicalLiquidity"

export async function lpWphrs() {
     const poolAddressUsdtPhrs = poolAddresses.filter(item => item.pair == "USDT/PHRS")[0].address
     const usdtAddress = tokenAddreses.filter(item => item.name == "USDT")[0].address
     const wphrsAddress = tokenAddreses.filter(item => item.name == "WPHRS")[0].address

      try {
          console.log("Liquidity WPHRS/USDT")
          await multicalLiquidity({
               poolAddress: poolAddressUsdtPhrs,
               tokenA: wphrsAddress,
               tokenB: usdtAddress
          })
     } catch (error) {
          console.error(error)
     }
}

