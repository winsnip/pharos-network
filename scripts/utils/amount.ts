interface AmountParams {
     min: number,
     max: number
}
export function randomAmount({min, max}:AmountParams){
    return Math.random() * (max - min) + min 
}