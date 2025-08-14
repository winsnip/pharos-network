import { tipAbi } from "@scripts/lib/data"
import { randomAmount } from "@scripts/utils/amount"
import { Contract, parseUnits, Wallet } from "ethers"
import { users } from "./data"
import { success } from "@scripts/utils/console"

interface TipParams {
     wallet: Wallet
}

const routerAddress = "0xd17512b7ec12880bd94eca9d774089ff89805f02"
export async function tip({
     wallet
}:TipParams) {
     const index = Math.floor(randomAmount({
          min: 0,
          max: users.length - 1
     }))
     const receiver = users[index]
     const amount = randomAmount({
          min: 0.0001,
          max: 0.001
     }).toFixed(5)

     const token = [ 1n, '0x0000000000000000000000000000000000000000' ]
     const sentTo = [ 'x', receiver, parseUnits(`${amount}`), [] ]

     const contract = new Contract(routerAddress, tipAbi, wallet)
     console.log(`sending ${amount} to ${receiver}...`)
     try {
          const tx = await contract.tip(token, sentTo, {
               value: parseUnits(`${amount}`)
          })
          await tx.wait()
          success({hash: tx.hash})
     } catch (error) {
          console.error(error)
     }
}
