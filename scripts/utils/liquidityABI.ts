export const liquidityABI = [
     "function balanceOf(address owner) view returns (uint256)",
     "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
     "function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
     "function burn(uint256 tokenId, uint128 liquidity) external",
     "function decreaseLiquidity((uint256,uint128,uint256,uint256,uint256)) external returns (uint256,uint256)",
     "function collect((uint256,address,uint128,uint128)) external returns (uint256,uint256)",
     "function sweepToken(address,uint256,address)",
     "function multicall(bytes[] data)"
]