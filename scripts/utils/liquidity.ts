import { ethers } from "hardhat"
import { liquidityABI } from "./liquidityABI"


const iface = new ethers.Interface(liquidityABI)

interface LiquidityParams {
     ownerAddress: string,
     router: string
}
export async function getLiquidity({
     ownerAddress,
     router
}:LiquidityParams) {
     const positionManager = new ethers.Contract(router, iface, ethers.provider)
     const balance = await positionManager.balanceOf(ownerAddress)
     console.log(`You've ${balance} positions`)

     const liquidities = []
     for(let i = 0; i < balance; i++){
          const tokenId = await positionManager.tokenOfOwnerByIndex(ownerAddress, i)
          const position = await positionManager.positions(tokenId)
          if(position.liquidity.toString() != '0'){
               const data = {
                    tokenId: tokenId.toString(),
                    liquidity: position.liquidity.toString(),
                    token0: position.token0,
                    token1: position.token1
               }
               liquidities.push(data)
          }
     }
     return liquidities
}

interface RemoveLiquidityParams {
     tokenId: string,
     liquidity: string,
     router: string,
     token0: string,
     token1: string
}
export async function removeLiquidityMulticall({
     tokenId,
     liquidity,
     router,
     token0,
     token1
}:RemoveLiquidityParams) {
     const [signer] = await ethers.getSigners()
     const routerContract = new ethers.Contract(router, liquidityABI, signer)
     const ifaceRouter = routerContract.interface
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10 // 10 minutes

     // 1. Decrease liquidity
     const decreaseParams = [
          Number(tokenId),       // position NFT ID
          BigInt(liquidity),     // amount of liquidity to remove
          0,             // amount0Min (for slippage tolerance)
          0,             // amount1Min
          deadline
     ]
     console.log("Calling decreaseLiquidity...")
     const encodeDecrease = ifaceRouter.encodeFunctionData("decreaseLiquidity", [decreaseParams])

     // 2. Collect tokens
     const MaxUint128 = (1n << 128n) - 1n;
     const collectParams = [
          tokenId,          // position NFT ID
          signer.address,   // recipient
          MaxUint128, // amount0Max
          MaxUint128  // amount1Max
     ]

     console.log("Calling collect...")
     const encodeCollect = ifaceRouter.encodeFunctionData("collect", [collectParams])

     console.log("Calling sweepToken...")
     const encodeSweepToken0 = ifaceRouter.encodeFunctionData("sweepToken", [token0, 0, signer.address])
     const encodeSweepToken1 = ifaceRouter.encodeFunctionData("sweepToken", [token1, 0, signer.address])

     // 3. Bundle into Multicall data
     const multicallData = [
          encodeDecrease,
          encodeCollect,
          encodeSweepToken0,
          encodeSweepToken1
     ]
     console.log("Calling multicall...")
     try {
          const tx = await routerContract.multicall(multicallData)
          await tx.wait()
          console.log(`txhash: ${tx.hash}`)
     } catch (error) {
          console.error(error)
     }
}