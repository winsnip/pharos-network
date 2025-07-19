import "tsconfig-paths/register"
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config(); // default fallback

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || ""

// Dynamically build the networks object
const networks: HardhatUserConfig["networks"] = {}

if(PRIVATE_KEY && ALCHEMY_API_KEY){
  networks['eth-sepolia'] = {
    accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks
}

export default config
