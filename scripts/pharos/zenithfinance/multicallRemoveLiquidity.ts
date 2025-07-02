import { ethers } from "hardhat"
import { getLiquidity, removeLiquidityMulticall } from "../../utils/liquidity"
import { sleep } from "../../utils/time"

const { UNI_V3_POS_ADDRESS_ZENITH = "", SET_TIMEOUT } = process.env
const timeout = Number(SET_TIMEOUT)

export async function removeLiquidities() {
     const [signer] = await ethers.getSigners()
     const liquidities = await getLiquidity({
          ownerAddress: signer.address,
          router: UNI_V3_POS_ADDRESS_ZENITH
     })
     for(let item of liquidities){
          if(item.liquidity == '0'){
               console.log(`${item.tokenId} has been removed`)
          }else{
               try {
                    await removeLiquidityMulticall({
                         tokenId: item.tokenId,
                         liquidity: item.liquidity,
                         router: UNI_V3_POS_ADDRESS_ZENITH,
                         token0: item.token0,
                         token1: item.token1
                    })
               } catch (error) {
                    console.error(error)
               }
          }
          await sleep(timeout)
     }
     console.log('Tasks completed!')
}