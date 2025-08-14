interface DateParams {
     hours: number,
     days: number
}

export function getFutureTimestamp({
     hours = 0,
     days = 0
}: DateParams) {
     const now = new Date()
     now.setMonth(now.getMonth() + 1)
     now.setDate(now.getDate() + days)
     now.setHours(now.getHours() + hours)

     return now.getTime()
}