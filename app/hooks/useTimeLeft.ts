import { useCountDown } from "ahooks"
import { useMemo } from "react"

export default function useTimeLeft({ time }: any) {
    const [countdown, { days, hours, minutes, seconds }] = useCountDown({
        leftTime: time ? (time - Date.now() < 0 ? 0: time - Date.now()) : 0
    })

    const timeFormat = useMemo(() => {
        const timeList = [days, hours, minutes, seconds]
        const timeStr = timeList.reduce((pre, next) => {
            if (!pre && Number(next) === 0) {
                return ''
            } else {
                const val = next < 10 ? `0${next}` : `${next}`
                if (!pre) {
                    return val
                } else {
                    return `${pre}:${val}`
                }
            }
        }, '')

        return timeStr

    }, [days, hours, minutes, seconds])

    return {
        timeFormat,
        days,
        hours,
        minutes,
        seconds,
        countdown
    }

}