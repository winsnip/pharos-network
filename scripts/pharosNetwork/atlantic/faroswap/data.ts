import { Wallet } from "ethers";

export interface Swap {
  tokenIn: string;
  tokenOut: string;
  deadline: number;
  signer: Wallet;
  amountIn: bigint;
  proxyUrl: string;
}

export const routerAbi: string[] = [
  "function mixSwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minOut, uint256 expectedOut, address[] dexes, address[] path, address[] adapters, uint256 fee, bytes[] data, bytes permit, uint256 id)",
];

export const routerAddress: string =
  "0x819829e5cf6e19f9fed92f6b4cc1edf45a2cc4a2";

export const routerPoolAMM: string =
  "0xb93cd1e38809607a00ff9cab633db5caa6130dd0";

export const urlRoute: string =
  "https://api.dodoex.io/route-service/v2/widget/getdodoroute?chainId=688689&apikey=a37546505892e1a952&slippage=3.225&source=dodoV2AndMixWasm&estimateGas=false";

export const poolAddressesAMM: string[] = [
  "0x8869167050bdbfb52a55c59b42c6654fa2d3e351",
  "0x768ae50448cbed00b54efdbdc02528a508ba325b",
  "0xb3886ee7bcbc24b6060a048fafed9f54ff9d9328",
  "0xd7a53400494cfdd71daf5aff8bd19d8e7efd62b4",
  "0x3798356a85901a55a151180171f2d2a10e9154e0",
  "0x02c1888197bbbbee59afec3aee62776834286db0",
  "0x85f2bd1243f8c12621bf57d8b77b8fc6607e7636",
  "0x4b9a6ca7dbf04de9e92eed6b9f876d9269e89f1c",
  "0x232dc962c2227b7446de7e3b2e446752bd4970c3",
  "0xebe71a51da308236fce1afcfe03e76a5b05e0090",
];
