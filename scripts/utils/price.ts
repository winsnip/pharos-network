import { ethers } from "hardhat"
import ERC20ABI from "../abi/ERC20.json"

//Reference https://etherscan.io/address/0xC75650fe4D14017b1e12341A97721D5ec51D5340
const poolAbi = [
  "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function fee() external view returns (uint24)"
]

interface TypeArgs {
  poolAddress: string,
  addresses:  Record<string, string>
}

export async function getPrice({
  poolAddress,
  addresses
}:TypeArgs) {
  const poolContract = new ethers.Contract(poolAddress, poolAbi, ethers.provider)

  const [slot0, token0, token1, fee] = await Promise.all([
    poolContract.slot0(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee()
  ])

  const address0 = new ethers.Contract(token0, ERC20ABI, ethers.provider)
  const decimal0 = await Promise.all([address0.decimals()])
  const address1 = new ethers.Contract(token1, ERC20ABI, ethers.provider)
  const decimal1 = await Promise.all([address1.decimals()])

  // https://blog.uniswap.org/uniswap-v3-math-primer
  const sqrtPriceX96 = slot0.sqrtPriceX96
  const price = (Number(sqrtPriceX96) ** 2) / (2 ** 192)
  const adjustedPrice = price * (10 ** (Number(decimal0) - Number(decimal1)))

  const tokenAToTokenB = addresses.tokenA.toLowerCase() === token0.toLowerCase() ? adjustedPrice : 1/adjustedPrice
  const tokenBToTokenA = 1 / tokenAToTokenB

  return {
    tokenAToTokenB, 
    tokenBToTokenA, 
    fee,
    token0,
    token1,
    slot0
  }
}

export function getTick({slot0, fee}: any){
  let tickSpacing:number = 1
  const currentTick:number = Number(slot0.tick)
  switch (fee) {
    case 100n:
      tickSpacing = 1
      break
    case 500n:
      tickSpacing = 10
      break
    case 3000n:
      tickSpacing = 60
      break
    case 10000n:
      tickSpacing = 100
      break
    default:
      console.log("Invalid fee tier")
      break
  }

  const tickLower = Math.floor(currentTick / tickSpacing - 1) * tickSpacing
  const tickUpper = Math.floor(currentTick / tickSpacing + 1) * tickSpacing

  return { tickLower, tickUpper }
}