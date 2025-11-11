import * as dotenv from "dotenv";
import { rpcList } from "@scripts/lib/data";
import { setupProvider } from "@scripts/utils/provider";
import { ownAddress } from "@scripts/utils/wallet";
import path from "path";

export const baseDir = path.resolve(__dirname, "../");
export const provider = setupProvider({
  rpcUrl: rpcList.atlantic_pharos_testnet,
});

export const wallet = ownAddress({
  dirname: baseDir,
  provider,
  key: "PRIVATE_KEY",
});

export function envLoaded() {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
  const { AMOUNT_IN_PERCENT, TIMEOUT_MIN_MS, TIMEOUT_MAX_MS } = process.env!;
  return {
    AMOUNT_IN_PERCENT: Number(AMOUNT_IN_PERCENT),
    TIMEOUT_MIN_MS: Number(TIMEOUT_MIN_MS),
    TIMEOUT_MAX_MS: Number(TIMEOUT_MAX_MS),
  };
}
