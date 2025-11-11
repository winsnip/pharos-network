import { Contract, JsonRpcProvider, Wallet } from "ethers";

export type Token = {
  name: string;
  address: string;
};
export const listToken: Token[] = [
  { name: "wphrs", address: "0x838800b758277CC111B2d48Ab01e5E164f8E9471" },
  { name: "usdt", address: "0xE7E84B8B4f39C507499c40B4ac199B050e2882d5" },
  { name: "usdc", address: "0xE0BE08c77f415F577A1B3A9aD7a1Df1479564ec8" },
  { name: "wbtc", address: "0x0c64f03eea5c30946d5c55b4b532d08ad74638a4" },
  { name: "weth", address: "0x7d211f77525ea39a0592794f793cc1036eeaccd5" },
  { name: "native", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
];

export const pairAbi: string[] = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];

export const addLPAbi: string[] = [
  "function addLiquidity(address tokenA, address tokenB, uint256 fee, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)",
];

type BaseContract = Omit<Contract, keyof any>;

export interface PairContract extends BaseContract {
  getReserves(): Promise<[bigint, bigint, number]>;
  token0(): Promise<string>;
  token1(): Promise<string>;
}

export interface GetReserves {
  reserve0: bigint;
  reserve1: bigint;
  token0: string;
  token1: string;
}

export interface GetReservesParams {
  poolAddress: string;
  provider: JsonRpcProvider;
}

export interface CreateLPParams {
  poolAddress: string;
  signer: Wallet;
  deadline: bigint;
  amountInPercent: number;
  router: string;
  provider: JsonRpcProvider;
}
