import { useCallback } from 'react'
import styles from './token.module.css'
import { Modal } from 'antd-mobile'
import BoostJust from '@/app/components/boost/boostJust'
import type { Project } from '@/app/type'
import { timeAgo } from '@/app/utils'
import SmokeBtn from '@/app/components/smokHot'
import { useRouter } from 'next/navigation'

interface Props {
    data: Project
}

export default function Token({ data }: Props) {
    const showBoostJust = useCallback(() => {
        const vipHandler = Modal.show({
            content: <BoostJust onBoost={() => {
                vipHandler.close()
            }} />,
            closeOnMaskClick: true,
        })
    }, [])

    const router = useRouter()

    return <div className={styles.main}>
        <div className={styles.tokenMag}>
            <div className={styles.tokenImgContent} onClick={() => {
                router.push('/detail?id=' + data.id)
            }}>
                <img className={styles.tokenImg} src={data.tokenImg} />
                <LaunchTag type={1} />
            </div>

            <div className={styles.nameContent}>
                <div className={styles.name}>{data.tokenName}</div>
                <div className={styles.trikerContent}>
                    <span>Ticker: {data.ticker}</span>
                    <img className={styles.createrImg} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                </div>
                <div className={styles.MarketCap}>Market cap: -</div>
                <div className={styles.createTime}>{timeAgo(data.time)}</div>
            </div>
        </div>

        <div className={styles.actionContent}>
            <div className={styles.actionItem} onClick={() => {
                showBoostJust()
            }}>
                <div className={styles.actionIcon}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle opacity="0.4" cx="24" cy="24" r="24" fill="black" />
                        <path d="M26.2085 13.7368C26.7914 13.8508 27.1659 14.3936 27.0424 14.9472L25.4857 21.9925L30.0805 23.2613C30.1991 23.2937 30.3113 23.3455 30.4124 23.4146C30.5262 23.4902 30.6231 23.5879 30.6972 23.7018C30.7714 23.8158 30.8212 23.9435 30.8437 24.0772C30.8662 24.2108 30.8608 24.3476 30.8279 24.4792C30.7951 24.6107 30.7353 24.7343 30.6525 24.8422L22.8878 35.0058C22.7615 35.1671 22.592 35.2901 22.3985 35.3609C22.205 35.4317 21.9953 35.4473 21.7933 35.4061C21.2104 35.2907 20.8359 34.7493 20.958 34.1957L22.5148 27.149L17.9199 25.8802C17.8006 25.8477 17.6881 25.7947 17.588 25.7269C17.4743 25.6513 17.3773 25.5536 17.3032 25.4397C17.229 25.3257 17.1792 25.198 17.1567 25.0644C17.1342 24.9307 17.1396 24.7939 17.1725 24.6623C17.2054 24.5308 17.2651 24.4073 17.3479 24.2994L25.1139 14.1371C25.2403 13.9758 25.4098 13.8527 25.6033 13.782C25.7968 13.7112 26.0065 13.6956 26.2085 13.7368Z" fill="#00FFEE" />
                    </svg>

                </div>
                <div className={styles.actionTimes}>
                    <span className={styles.whiteAmount}>0</span>
                    <span>/2</span>
                </div>
            </div>

            <div className={styles.actionItem}>
                <div>
                    <SmokeBtn token={data} onClick={() => {
                        // onSuperLike && onSuperLike()
                    }} />
                    <div className={styles.actionTimes}>
                        <span className={styles.whiteAmount}>0</span>
                        <span>/2</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function LaunchTag({ type }: { type: number }) {
    if (type === 1) {
        return <div className={styles.launchTag + ' ' + styles.launch1}>Pre-Launch</div>
    }

    if (type === 2) {
        return <div className={styles.launchTag + ' ' + styles.launch2}>Pre-Launch</div>
    }

    if (type === 3) {
        return <div className={styles.launchTag + ' ' + styles.launch3}>Pre-Launch</div>
    }
}