import "dotenv/config"
import { ethers } from "hardhat"
import ERC20ABI from "../../abi/ERC20.json"
import { getPrice, getTick } from "../../utils/price"
import { getTokenBalance } from "../../utils/amount"

interface MulticallLiquidtyProvider {
     poolAddress: string,
     tokenA: string,
     tokenB: string
}

const { UNI_V3_POS_ADDRESS_ZENITH = "",
     AMOUNT_IN_PERCENT = ""
} = process.env
const amount = `${AMOUNT_IN_PERCENT}00`

export async function multicalLiquidity({
     poolAddress,
     tokenA,
     tokenB,
}:MulticallLiquidtyProvider) {
     const [signer] = await ethers.getSigners()
     const fromPoolAddress = await getPrice({
          poolAddress,
          addresses: {
               "tokenA": tokenA,
               "tokenB": tokenB
          }
     })
     const tick = getTick({
          slot0: fromPoolAddress.slot0,
          fee: fromPoolAddress.fee
     })
     
     const token0 = fromPoolAddress.token0.toLowerCase() == tokenA.toLowerCase() ? tokenA : tokenB
     const token1 = fromPoolAddress.token1.toLowerCase() == tokenA.toLowerCase() ? tokenA : tokenB
     const token0ToToken1Price = fromPoolAddress.token0.toLowerCase() == token0.toLowerCase() ? fromPoolAddress.tokenAToTokenB : fromPoolAddress.tokenBToTokenA

     let {balance: token0Balance, decimals: token0Decimals, symbol: token0Symbol} = await getTokenBalance(signer.address, token0, ERC20ABI)
     let {balance: token1Balance, decimals: token1Decimals, symbol: token1Symbol} = await getTokenBalance(signer.address, token1, ERC20ABI)
     
     const token0ToToken1Scaled = BigInt(Math.floor(token0ToToken1Price * 1e18)); // scale with 18 decimals
     let amount0Desired = token0Balance / BigInt(amount); // % from balance
     
     // Scale to 18-decimal precision for internal calculation
     const precision = 10n ** 18n;

     // Normalize amount0 to 18 decimals
     const amount0_18dec = amount0Desired * precision / (10n ** BigInt(token0Decimals));

     // Now compute amount1 in 18 decimals, then scale down to token1 decimals
     const amount1_18dec = amount0_18dec * token0ToToken1Scaled / precision;
     const amount1Desired = amount1_18dec * (10n ** BigInt(token1Decimals)) / precision;


     console.log({amount0Desired,token0Decimals, amount1Desired, token1Decimals})



     const iface = new ethers.Interface([
          "function mint(tuple(address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
          "function multicall(bytes[] data)"
     ])
     const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 mins from now

     const paramsMint = [
          token0,
          token1,
          fromPoolAddress.fee,
          tick.tickLower,     // tickLower
          tick.tickUpper,     // tickUpper
          amount0Desired,
          amount1Desired,
          0,   // amount0Min
          0,   // amount1Min
          signer.address,
          deadline
     ]

     const encodedMint = iface.encodeFunctionData("mint", [paramsMint])

     const IERC20ContractToken0 = new ethers.Contract(token0, ERC20ABI, signer)
     console.log("Checking allowance...")
     const allowance0 = await IERC20ContractToken0.allowance(signer.address, UNI_V3_POS_ADDRESS_ZENITH)
     if (allowance0 < amount0Desired) {
          console.log("Approving to router...")
          const approveTx = await IERC20ContractToken0.approve(UNI_V3_POS_ADDRESS_ZENITH, amount0Desired)
          await approveTx.wait()
          console.log(`Approved: ${approveTx.hash}`)
     }

     const IERC20ContractToken1 = new ethers.Contract(token1, ERC20ABI, signer)
     console.log("Checking allowance...")
     const allowance1 = await IERC20ContractToken1.allowance(signer.address, UNI_V3_POS_ADDRESS_ZENITH)
     if (allowance1 < amount1Desired) {
          console.log("Approving to router...")
          const approveTx = await IERC20ContractToken1.approve(UNI_V3_POS_ADDRESS_ZENITH, amount1Desired)
          await approveTx.wait()
          console.log(`Approved: ${approveTx.hash}`)
     }
     console.log(`${token0Symbol}: ${ethers.formatUnits(amount0Desired, token0Decimals)}, ${token1Symbol}: ${ethers.formatUnits(amount1Desired, token1Decimals)}`)
     const routerContract = new ethers.Contract(UNI_V3_POS_ADDRESS_ZENITH, iface, signer)
     try {
          const tx = await routerContract.multicall([encodedMint])
          await tx.wait()
          console.log(`txHash: ${tx.hash}`)
     } catch (error) {
          console.error(error)
     }
}