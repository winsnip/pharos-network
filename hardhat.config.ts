import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

// Dynamically build the networks object
const networks: HardhatUserConfig["networks"] = {};

if (process.env.ALCHEMY_API_KEY && process.env.PRIVATE_KEY) {
  networks["eth-sepolia"] = {
    url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    timeout: 60000,
  };
}

if (process.env.PRIVATE_KEY) {
  const pharosUrl = "https://api.zan.top/node/v1/pharos/testnet/c27183ebdf3748b393aa04ac2d4d1e57";
  networks["pharos-testnet-zantoprpc"] = {
    url: pharosUrl,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chainId: 688688,
    timeout: 60000,
  };
  networks["pharos-testnet-officialrpc"] = {
    url: "https://testnet.dplabs-internal.com",
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chainId: 688688,
    timeout: 60000,
  };
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks,
};

export default config;