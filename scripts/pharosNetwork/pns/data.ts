export const router = "0x51be1ef20a1fd5179419738fc71d95a8b6f8a175"
export const resolverAddress = "0x9a43dcA1C3BB268546b98eb2AB1401bFc5b58505"
export const abiPNS = [
     "function commit(bytes32)",
     "function register(string,address,uint256,bytes32,address,bytes[],bool,uint16) public payable",
     "function rentPrice(string name, uint256 duration) public view returns (uint256)",
     "function makeCommitment(string,address,uint256,bytes32,address,bytes[],bool,uint16) view returns (bytes32)"
]
export const resolverAbi = [
     "function setAddr(bytes32,uint256,bytes)"
]