


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

setup private key
```bash
echo PRIVATE_KEY=your_private_key_here >> main/.env
```
setup loop count ( how many time you will run script in main.ts )
```bash
echo LOOP_COUNT=your_loop_count_here >> main/.env
```
setup amount in percent, it set for each tx of your asset. for example use 1% from asset balance
```bash
echo AMOUNT_IN_PERCENT=1 >> main/.env
```
set timeout in milisecond, it set for waiting next tx. for example below, next tx will be done in ranges 1minute to 2minutes
```bash
echo TIMEOUT_MIN_MS=60000 >> main/.env
echo TIMEOUT_MAX_MS=120000 >> main/.env
```
setup Autostaking Access token
open https://autostaking.pro/?env=pharos, connect wallet > open devmode > tab console, paste code below
```bash
localStorage.getItem("token")
```
copy that value token, then run in terminal
```bash
echo AUTOSTAKING_TOKEN="your_token_here" >> main/.env
```

**Optional** Set Rpc Url
```bash
echo RPC_URL=your_rpc_url_here >> main/.env
```

### 5. Create a New Screen Session

```bash
screen -S pharos
```

### 6. Start the Bot

#### Command lists

##### Rwafi Aquaflux

```bash
npm run rwafiAquaflux
```

##### Autostaking

###### faucet

```bash
npm run autostakingFaucet
```

###### deposit

```bash
npm run autostakingDeposit
```

###### withdraw

```bash
npm run autostakingWithdraw
```

##### CFD Trading / Brokex

```bash
npm run openCfdTrade
```

##### Faroswap

###### USDC Liquidity

```bash
npm run faroswapUsdcLiquidity
```

###### USDT Liquidty

```bash
npm run faroswapUsdtLiquidty
```

###### USDC Swap

```bash
npm run faroswapUsdcSwap
```

###### WPHRS Swap

```bash
npm run faroswapWphrsSwap
```

##### Pharos Name Service

```bash
npm run pns
```

##### Primus

```bash
npm run primus
```

##### Zenith

###### USDC Liquidity

```bash
npm run zenithUsdcLiquidity
```

###### WPHRS Liquidity

```bash
npm run zenithWphrsLiquidity
```

###### USDC Swap

```bash
npm run zenithUsdcSwap
```

###### USDT Swap

```bash
npm run zenithUsdtSwap
```

###### WPHRS Swap

```bash
npm run zenithWphrsSwap
```

##### RWAFI R2

###### Swap
```bash
npm run rwafiR2Swap
```

###### Earn
```bash
npm run rwafiR2Earn
```

### 7. Detach the Screen Session
Press: Ctrl + A, then D

### 8. Reattach the Screen Session

```bash
screen -R pharos
```

# Done!
Your bot is running in the background on the Pharos Network.

⚠️ **NOTES** 
- Make sure your wallet is funded with enough gas (PHRS). 
     - list faucet: 
          - https://testnet.pharosnetwork.xyz/
          - https://web3.okx.com/ru/faucet/pharos/100013
          - https://newshare.bwb.global/en/earnCoinsTasks?uuid=6b728693-35b6-4892-9991-a45e63aaf2a1&_nocache=true&_nobar=true&_needChain=eth
          - https://zan.top/faucet/pharos
          - https://www.gas.zip/
          - R2 https://discord.com/invite/WYjCvtyh
- Use at your own risk. Test carefully on testnet.
- This project for educational and testing purposes only.


Coffee: https://trakteer.id/Winsnipsupport/tip


## **Join Telegram Winsnip**

Stay updated and connect with the Winsnip community:

Channel: https://t.me/winsnip

Group Chat: https://t.me/winsnip_hub

This ensures users can join the Telegram community easily and stay engaged with updates and discussions.



## **Have suggestions or improvements? Feel free to contribute!**