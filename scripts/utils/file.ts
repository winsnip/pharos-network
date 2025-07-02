import path from "path"
import fs from "fs"

function saveData(
    data:string,
    fileName:string,
){
    const directoryTarget = path.join(__dirname,`../../logs/${fileName}.txt`)
    fs.writeFile(directoryTarget, data, error => {
        if(error){
            console.log(`Failed save data: ${error}`)
        }else{
            console.log(`saved succesfully at: ${directoryTarget}`)
        }
    } )
}

export { 
    saveData
}