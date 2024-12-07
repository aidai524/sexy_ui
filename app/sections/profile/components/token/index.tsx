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
                router.push('/detail/' + data.id)
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
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="18" fill="#00FFEE" />
                        <path d="M3.91302 18C3.91302 25.7801 10.22 32.087 18 32.087C25.78 32.087 32.0869 25.7801 32.0869 18C32.0869 10.22 25.78 3.91309 18 3.91309" stroke="black" stroke-width="2" stroke-linecap="round" />
                        <path d="M19.7642 10.1909C20.2299 10.2771 20.5291 10.6879 20.4305 11.107L19.1867 16.4393L22.8576 17.3996C22.9523 17.4241 23.042 17.4634 23.1228 17.5157C23.2137 17.5728 23.2911 17.6468 23.3503 17.7331C23.4096 17.8193 23.4494 17.9159 23.4674 18.0171C23.4853 18.1183 23.481 18.2218 23.4548 18.3214C23.4285 18.421 23.3808 18.5145 23.3146 18.5961L17.1113 26.2886C17.0104 26.4107 16.8749 26.5038 16.7203 26.5574C16.5658 26.6109 16.3983 26.6228 16.2369 26.5916C15.7712 26.5043 15.472 26.0945 15.5695 25.6755L16.8132 20.3421L13.1424 19.3818C13.047 19.3571 12.9572 19.3171 12.8772 19.2657C12.7863 19.2086 12.7089 19.1346 12.6496 19.0484C12.5904 18.9621 12.5506 18.8655 12.5326 18.7643C12.5147 18.6631 12.5189 18.5596 12.5452 18.46C12.5715 18.3604 12.6192 18.267 12.6854 18.1853L18.8898 10.4938C18.9907 10.3717 19.1262 10.2786 19.2807 10.2251C19.4353 10.1715 19.6028 10.1597 19.7642 10.1909Z" fill="black" />
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