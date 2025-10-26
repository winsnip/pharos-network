import { approve } from "@scripts/utils/approve";
import { success } from "@scripts/utils/console";
import { Contract, formatUnits, Wallet } from "ethers";

interface MetadataToken {
  name: string;
  decimals: string;
  symbol: string;
  balance: bigint;
}
interface Asseto {
  tokenIn: string;
  amount: bigint;
  spender: string;
  signer: Wallet;
  abi: string[];
  metadataTokenIn: MetadataToken;
}
export async function subscribe({
  tokenIn,
  amount,
  spender,
  signer,
  abi,
  metadataTokenIn,
}: Asseto) {
  await approve({
    tokenAddress: tokenIn,
    signer,
    router: spender,
    amount,
  });
  const contract = new Contract(spender, abi, signer);
  console.log(
    `Subcribing ${formatUnits(amount, metadataTokenIn.decimals)} ${
      metadataTokenIn.symbol
    }...`
  );
  const tx = await contract.subscribe(tokenIn, amount);
  await tx.wait();
  success({ hash: tx.hash });
}

interface Redemption extends Asseto {
  tokenOut: string;
}
export async function redemption({
  tokenIn,
  amount,
  spender,
  signer,
  abi,
  metadataTokenIn,
  tokenOut,
}: Redemption) {
  const contract = new Contract(spender, abi, signer);
  await approve({
    tokenAddress: tokenIn,
    signer,
    router: spender,
    amount,
  });
  console.log(
    `Redemption ${formatUnits(amount, metadataTokenIn.decimals)} ${
      metadataTokenIn.symbol
    }...`
  );
  const tx = await contract.redemption(tokenOut, amount);
  await tx.wait();
  success({ hash: tx.hash });
}
