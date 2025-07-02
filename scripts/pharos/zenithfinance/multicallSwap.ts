import { ethers } from "hardhat"

interface MulticallParams {
  routerAddress: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: bigint,
  amountOut: bigint,
  fee: number
}

export async function multicallSwap({
  routerAddress,
  tokenInAddress,
  tokenOutAddress,
  amountIn,
  amountOut,
  fee,
}:MulticallParams) {
  const [signer] = await ethers.getSigners()
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10

  const paramsExactInputSingle = {
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    fee,
    recipient: signer.address,
    amountIn,
    amountOutMinimum: amountOut,
    sqrtPriceLimitX96: 0,
  }

  const exactInputSingleAbi = [
    "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96))"
  ]
  const ifaceExactInputSingle = new ethers.Interface(exactInputSingleAbi)
  const exactInputSingleData = ifaceExactInputSingle.encodeFunctionData("exactInputSingle", [paramsExactInputSingle])

  const routerIface = new ethers.Interface([
    "function multicall(uint256 deadline, bytes[] data) external payable returns (bytes[] memory)",
  ])

  const IERC20Contract = new ethers.Contract(tokenInAddress, [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
  ], signer)

  console.log("Checking allowance...")
  const allowance = await IERC20Contract.allowance(signer.address, routerAddress)
  if (allowance < amountIn) {
    console.log("Approving to router...")
    const approveTx = await IERC20Contract.approve(routerAddress, amountIn)
    await approveTx.wait()
    console.log(`Approved: ${approveTx.hash}`)
  }

  const routerContract = new ethers.Contract(routerAddress, routerIface, signer)
  try {
    console.log("Swapping via multicall...")
    const tx = await routerContract.multicall(deadline, [exactInputSingleData])
    await tx.wait()
    console.log(`tx hash: ${tx.hash}`)
  } catch (error) {
    console.error("Swap failed:", error)
  }
}
