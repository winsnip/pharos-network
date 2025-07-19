import * as dotenv from "dotenv"
import path from "path"
import usdcLiquidityFaros from "./faroswap/usdcLiquidity"
import usdcSwapFaros from "./faroswap/usdcSwap"
import usdtLiquidityFaros from "./faroswap/usdtLiquidity"
import wphrsSwapFaros from "./faroswap/wphrsSwap"
import usdcLiquidityZenith from "./zenithFinance/usdcLiquidity"
import usdcSwapZenith from "./zenithFinance/usdcSwap"
import usdtSwapZenith from "./zenithFinance/usdtSwap"
import wphrsLiquidityZenith from "./zenithFinance/wphrsLiquidity"
import wphrsSwapZenith from "./zenithFinance/wphrsSwap"

async function main() {
     dotenv.config({path: path.resolve(__dirname, ".env")})
     const loop = Number(process.env.LOOP_COUNT!)
     
     for(let index = 1; index <= loop; index++ ){
          console.log(`loop ${index}/${loop}`)
          await usdcLiquidityFaros()
          await usdcSwapFaros()
          await usdtLiquidityFaros()
          await wphrsSwapFaros()
          await usdcLiquidityZenith()
          await usdcSwapZenith()
          await usdtSwapZenith()
          await wphrsLiquidityZenith()
          await wphrsSwapZenith()
     }
}
main().catch(console.error)
