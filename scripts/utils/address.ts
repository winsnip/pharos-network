import "dotenv/config";
import { ethers } from "hardhat"
import fs from "fs"
import path from "path"
import { BlockTag } from "ethers"

let addresses: Array<string> = []
const countAddresses:number = Number(process.env.COUNT_ADDRESS_SCRAPING)
const outputDirectory = path.join(__dirname, "..", "..")
const fileName = path.join(outputDirectory, "addresses.txt")

const blockListener = async (blocknumber: BlockTag) => {
        const block = await ethers.provider.getBlock(blocknumber, true)

        if(block && block.transactions){
            const blockHash = block.transactions[0]
            if(blockHash){
                const tx = await ethers.provider.getTransaction(blockHash)
                tx?.from && addresses.push(tx.from)
                console.dir(tx?.from, {depth: null})
            }
        }
        if(addresses.length == countAddresses){
            console.log(`Scraping completed!`)
            ethers.provider.off("block")
            saveAddressesToFile(addresses,fileName)
        }
}

function saveAddressesToFile(addresses:Array<string>, fileName:string){
    const data = addresses.join("\n")
    fs.writeFile(fileName,data, (error) => {
        if(error){
            console.error("Error to writing file: ", error)
        }else{
            console.log(`Addresses successfully saved to ${fileName}`)
        }
    })

}

async function getActiveAddressOnChain() {
    console.log("Scanning new block onchain...")
    ethers.provider.on("block",blockListener)
}

function getOwnAddress() {
    const privateKey = process.env.PRIVATE_KEY;
    const walletAddress = new ethers.Wallet(privateKey || '', ethers.provider)

    return walletAddress.address
}

export {
    getActiveAddressOnChain,
    saveAddressesToFile,
    getOwnAddress
}