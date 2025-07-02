


# Pharos Network Swap and Liquidity Bot

This project is a simple automated script to interact with the **Pharos Network**, performing token swaps and liquidity-related operations.

## Features

- Token Swapping on Pharos Network
- Liquidity Management
- Headless execution using `screen`
- Configurable private key and loop count for batch operations

---

## Getting Started


### 1. Clone the Repository

```bash
git clone https://github.com/takachan0012/pharos-network.git
```


### 2. Navigate to the Project Directory
```bash
cd pharos-network
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Environment Variables
create .env file
```bash
mv .env-example .env
```
setup private key
```bash
echo PRIVATE_KEY=your_private_key_here >> .env
```
setup loop count ( how many time you create transaction )
```bash
echo LOOP_COUNT=your_loop_count_here >> .env
```
setup amount in percent, it set for each tx of your asset.
```bash
echo AMOUNT_IN_PERCENT=1 >> .env
```
set timeout in milisecond, it set for waiting before next tx.
```bash
echo SET_TIMEOUT=60000 >> .env
```

### 5. Create a New Screen Session
```bash
screen -S pharos
```

### 6. Start the Bot
- To use the official Pharos RPC
```bash
npm run start-officialrpc
```

- To use the Zantop RPC
```bash
npm run start-zantoprpc

```
⚠️ **NOTES**
Only run one of the above commands. Do not run both at the same time.

### 7. Detach the Screen Session
Press: Ctrl + A, then D

### 8. Reattach the Screen Session
```bash
screen -R pharos
```

## Done!
Your bot is now running in the background on the Pharos Network.

⚠️ **NOTES** 
- Make sure your wallet is funded with enough gas (PHRS). 
     - list faucet: 
          - https://testnet.pharosnetwork.xyz/
          - https://web3.okx.com/ru/faucet/pharos/100013
          - https://newshare.bwb.global/en/earnCoinsTasks?uuid=6b728693-35b6-4892-9991-a45e63aaf2a1&_nocache=true&_nobar=true&_needChain=eth
          - https://zan.top/faucet/pharos
          - https://www.gas.zip/
- Use at your own risk. Test carefully on testnets.
- This project is for educational and testing purposes only.


Coffee: https://trakteer.id/Winsnipsupport/tip


## **Join Telegram Winsnip**

Stay updated and connect with the Winsnip community:

Channel: https://t.me/winsnip

Group Chat: https://t.me/winsnip_hub

This ensures users can join the Telegram community easily and stay engaged with updates and discussions.



## **Have suggestions or improvements? Feel free to contribute!**
