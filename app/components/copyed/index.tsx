import { useState } from "react"
import styles from './style.module.css'

const defaultColor = '#808095'


export default function Copyed({ value }: { value: string }) {
    const [color, setColor] = useState(defaultColor)
    const [tipShow, setTipShow] = useState(false)
    const [tip, setTip] = useState('Copy')

    return <div className={styles.copy} onMouseEnter={() => {
        setColor('#fff')
        setTipShow(true)
        setTip('Copy')
    }} onMouseLeave={() => {
        setColor(defaultColor)
        setTipShow(false)
    }} onClick={async () => {
        try {
            await navigator.clipboard.writeText(value)
            setTipShow(true)
            setTip('Copied')
            setColor('rgba(255, 122, 0, 1)')
        } catch (e) {

        }
    }}>
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="6"
                y="6"
                width="9"
                height="9"
                rx="2"
                stroke="#979ABE"
                strokeWidth="2"
            />
            <path
                d="M10 4V3C10 1.89543 9.10457 1 8 1H3C1.89543 1 1 1.89543 1 3V8C1 9.10457 1.89543 10 3 10H4"
                stroke="#979ABE"
                strokeWidth="2"
            />
        </svg>

        {
            tipShow && <div className={styles.tip}>{tip}</div>
        }

    </div>
}