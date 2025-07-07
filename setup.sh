#!/bin/bash

echo "🚀 Setting up Pharos Bot..."

# 1. Install dependencies
sudo apt update
sudo apt install nodejs npm screen git -y

# 2. Install project dependencies
npm install
npm install --save-dev ts-node typescript @types/node dotenv

# 3. Setup .env
echo "✅ Creating .env file..."
cat <<EOF > .env
PRIVATE_KEY=0x066566119aa3e42c6f622fa845b2d68d5fee5271a958c76de589bb78c0402a6d
LOOP_COUNT=3
AMOUNT_IN_PERCENT=1
SET_TIMEOUT=60000
EOF

# 4. Replace hardhat.config.ts with hardhat.config.js
echo "🔁 Converting Hardhat config to JS..."

cat <<EOF > hardhat.config.js
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    "pharos-testnet-officialrpc": {
      url: "https://testnet.dplabs-internal.com",
      chainId: 688688,
      accounts: [process.env.PRIVATE_KEY]
    },
    "pharos-testnet-zantoprpc": {
      url: "https://api.zan.top/node/v1/pharos/testnet/c27183ebdf3748b393aa04ac2d4d1e57",
      chainId: 688688,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
EOF

# 5. Start bot in screen
echo "🧠 Starting bot in screen session..."
screen -dmS pharos-bot bash -c "npx hardhat run scripts/main.ts --network pharos-testnet-officialrpc; exec bash"

echo "✅ Done! Bot is running inside screen session 'pharos-bot'."
echo "👉 To attach: screen -r pharos-bot"
