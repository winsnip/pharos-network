import "dotenv/config"
import { lpUSDC } from "./pharos/zenithfinance/lpUSDCToOthers"
import { lpWphrs } from "./pharos/zenithfinance/lpWPHRSToOthers"
import { swapUSDC } from "./pharos/zenithfinance/swapUSDCToOthers"
import { swapUSDT } from "./pharos/zenithfinance/swapUSDTtoOthers"
import { swapWphrs } from "./pharos/zenithfinance/swapWPHRSToOthers"

const { LOOP_COUNT } = process.env || ""

async function main() {
     const loop = Number(LOOP_COUNT)
     for(let i = 1; i <= loop; i++){
          console.log(`run ${i}/${loop}`)
          try {
               await lpUSDC()
               await lpWphrs()
               await swapUSDC()
               await swapUSDT()
               await swapWphrs()
          } catch (error) {
               console.error(error)
          }     
     }
}

main().catch(console.error)