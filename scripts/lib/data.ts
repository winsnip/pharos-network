export const rpcList = {
     pharos_official: "https://testnet.dplabs-internal.com"
}

export const pharosTokenAddress = [
     {
          "name": "USDC",
          "address": "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED"
     },
     {
          "name": "USDT",
          "address": "0xD4071393f8716661958F766DF660033b3d35fD29"
     },
     {
          "name": "WPHRS",
          "address": "0x76aaaDA469D23216bE5f7C596fA25F282Ff9b364"
     }, 
     {
          "name": "WPHRS_FAROSWAP",
          "address": "0x3019B247381c850ab53Dc0EE53bCe7A07Ea9155f"
     }
]

export const pharosPoolAddressZenith = [
     {
          "pair": "USDC/USDT",
          "address": "0x5EB17047d15bb1f6D1B00f591B5F586E0378fe00"
     },
     {
          "pair": "USDC/PHRS",
          "address": "0xf49FE9a0397b3bD750db14CD039201ac0429369e"
     },
     {
          "pair": "USDT/PHRS",
          "address": "0x073EbD8F7E6C932CE50a570593666BA60e83Cce2"
     }

]

export const pharosPoolAddressPMMFaroswap = [
     {
          "pair": "USDC/WPHRS",
          "address": [
               "0x596be65cf84c2ad87b8a17a3d4f10fc1359544ec","0xfffeda09a8305835cad319dd4eb1e651cfd98948",
               "0xfffd40f741de84a9cc5676d55ad046b2903800e0",
               "0xfff8e77cdb69295c461db9502430503243a1cae9",
               "0xfffbbb209badbf710be16fd29d9a16ea0aa0b718",
               "0xffd8b2c7526ccb07d1fec4fbb946bde17aec7229",
               "0x36d24f86ba32d8a73e9a91e08bac90bf2483809c"
          ]
     },
     {
          "pair": "USDT/USDC",
          "address": [
               "0xfffcd0e704c621caecc8b8d8892f64706095ce0c",
               "0xff7129709ebd3485c4ed4fef6dd923025d24e730",
               "0xffe9069bbf9beed28c7396c8dabc6523ae0676a6",
               "0xffd83a7720f01fff1e8dce44878fdccc548f8ff0",
               "0xfe503d9e0397880b4c5b44a267d017fcfdb7625e",
               "0x3c5d785b45865f781cc8a295bec758f4703b6dff",
               "0xf777486eb6660612f42cbdd1b2289087a52e214a"
          ]
     },
     {
          "pair": "USDT/WPHRS",
          "address": [
               "0x034c1f84eb9d56be15fbd003e4db18a988c0d4c6",
               "0xfffc85d26fbd166f3bd86d544e5e10a35de222cf",
               "0xfa4b6d07e4722074d41f6592f09492dc66fd4f43",
               "0xd637d06c8cfa7f11110e3257c0ed6893ae33cae7",
               "0x789cf73ea6c2896437e2b26ccdfaeeacd1b507e6",
          ]
     }
]

export const liquidityABI = [
     "function balanceOf(address owner) view returns (uint256)",
     "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
     "function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
     "function burn(uint256 tokenId, uint128 liquidity) external",
     "function decreaseLiquidity((uint256,uint128,uint256,uint256,uint256)) external returns (uint256,uint256)",
     "function collect((uint256,address,uint128,uint128)) external returns (uint256,uint256)",
     "function sweepToken(address,uint256,address)",
     "function multicall(bytes[] data)",
     "function mint(tuple(address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
     "function addDVMLiquidity(address dvmAddress, uint256 baseInAmount, uint256 quoteInAmount, uint256 baseMinAmount, uint256 quoteMinAmount, uint8 flag, uint256 deadLine)",
     "function getPMMState() view returns (address, address, uint112, uint112, uint256, uint256)",
     "function querySellBase(uint256) external view returns (uint256)",
     "function baseToken() view returns (address)",
     "function quoteToken() view returns (address)"

]

export const exactInputSingleAbi = [
    "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96))"
]

export const multicallAbi = [
     "function multicall(uint256 deadline, bytes[] data) external payable returns (bytes[] memory)"
]

export const tipAbi = [
  "function tip((uint32,address),(string,string,uint256,uint256[])) external"
]

export const VaultMulticall_v2Abi = [
     "function withdrawFromVault(address vault, uint256 assets, address receiver, address owner) payable",
     "function multicall(bytes[] data)",
     "function depositToVault(address vault, uint256 assets, address receiver) payable"
]