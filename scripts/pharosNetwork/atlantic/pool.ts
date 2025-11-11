import { Contract } from "ethers";
import { GetReserves, GetReservesParams, pairAbi } from "./generalData";

export async function getReserve({
  poolAddress,
  provider,
}: GetReservesParams): Promise<GetReserves> {
  const pair = new Contract(poolAddress, pairAbi, provider);
  const [reserve0, reserve1] = await pair.getReserves();
  const [token0, token1] = [await pair.token0(), await pair.token1()];

  return { reserve0, reserve1, token0, token1 };
}
