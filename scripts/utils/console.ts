interface ConsoleParam {
     hash?: string,
     errorMessage?: string | undefined | unknown,
}
export function success({
     hash
}:ConsoleParam){
     console.log(`Success! txhash: ${hash}`)
}

export function failed({
     errorMessage
}:ConsoleParam){
     console.error(`Failed: ${errorMessage}`)
}