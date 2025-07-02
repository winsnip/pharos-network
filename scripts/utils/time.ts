function formatTime(ms: number):string{
    const totalSecond = Math.floor(ms/1000)
    const hours = Math.floor(totalSecond/3600)
    const minutes = Math.floor((totalSecond % 3600) / 60)
    const second = totalSecond % 60

    return `${hours}H ${minutes}M ${second}S`
}

const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))


export {
    formatTime,
    sleep
}