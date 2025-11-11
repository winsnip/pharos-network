import { tokenBalance } from "@scripts/utils/balance";
import { addLPAbi, CreateLPParams } from "../generalData";
import { getReserve } from "../pool";
import { Contract } from "ethers";
import { success } from "@scripts/utils/console";
import { approve } from "@scripts/utils/approve";

const SLIPPAGE: bigint = 1n;
const FEE: bigint = 1n;

export async function createLP({
  poolAddress,
  signer,
  deadline,
  amountInPercent,
  router,
  provider,
}: CreateLPParams) {
  const { reserve0, reserve1, token0, token1 } = await getReserve({
    poolAddress,
    provider,
  });
  const percent: bigint = BigInt(amountInPercent);
  const { balance: token0balance, symbol: token0Symbol } = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: token0,
  });
  const amountToken0Desired: bigint = (token0balance * percent) / 100n;
  const amountToken1Desired: bigint =
    (reserve1 * amountToken0Desired) / reserve0;

  const { balance: token1Balance, symbol: token1Symbol } = await tokenBalance({
    address: signer.address,
    provider,
    tokenAddress: token1,
  });
  console.log(`Selected pair ${token0Symbol}/${token1Symbol}`);
  if (token1Balance < amountToken1Desired) {
    throw Error(`Insufficient balance ${token1Symbol}`);
  }
  await approve({
    tokenAddress: token0,
    signer,
    router,
    amount: amountToken0Desired,
  });
  await approve({
    tokenAddress: token1,
    signer,
    router,
    amount: amountToken1Desired,
  });
  const amountToken0Min = (amountToken0Desired * SLIPPAGE) / 100n;
  const amountToken1Min = (amountToken1Desired * SLIPPAGE) / 100n;

  console.log("Creating liquidity...");
  const createRouter = new Contract(router, addLPAbi, signer);
  const tx = await createRouter.addLiquidity(
    token0,
    token1,
    FEE,
    amountToken0Desired,
    amountToken1Desired,
    amountToken0Min,
    amountToken1Min,
    signer.address,
    deadline,
    {
      gasLimit: 3_000_000,
    }
  );

  await tx.wait();
  success({ hash: tx.hash });
}
