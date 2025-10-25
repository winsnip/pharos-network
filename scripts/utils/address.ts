import { BlockTag, JsonRpcProvider } from "ethers";

interface GetActiveAddress {
  rpc: string;
  countAddress: number;
}

export async function getActiveAddressOnChain({
  rpc,
  countAddress,
}: GetActiveAddress): Promise<string[]> {
  const provider = new JsonRpcProvider(rpc);
  const addresses: Set<string> = new Set<string>();
  console.log("Scanning new block onchain...");
  console.log("Fetching active address onchain...")
  return new Promise((resolve) => {
    provider.on("block", async ({ blocknumber }: { blocknumber: BlockTag }) => {
      const block = await provider.getBlock(blocknumber, true);
      if (!block || !block.transactions) return;
      for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);
        if (tx?.from) addresses.add(tx.from);
        if (addresses.size >= countAddress) {
          provider.off("block");
          resolve([...addresses]);
          return;
        }
      }
    });
  });
}
