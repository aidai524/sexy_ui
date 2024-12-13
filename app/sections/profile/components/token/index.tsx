import { useCallback, useState } from 'react'
import styles from './token.module.css'
import { Modal } from 'antd-mobile'
import BoostJust from '@/app/components/boost/boostJust'
import type { Project } from '@/app/type'
import { timeAgo } from '@/app/utils'
import SmokeBtn from '@/app/components/smokHot'
import { useRouter } from 'next/navigation'
import Boost from '@/app/components/boost'
import useTimeLeft from '@/app/hooks/useTimeLeft'
import LauncdedAction from '@/app/components/action/launched'

interface Props {
    data: Project
}

export default function Token({ data }: Props) {
    const router = useRouter()
    const { timeFormat } = useTimeLeft({ time: data.boostTime })

    return <div className={styles.main}>
        <div className={styles.tokenMag}>
            <div className={styles.tokenImgContent} onClick={() => {
                router.push('/detail?id=' + data.id)
            }}>
                <img className={styles.tokenImg} src={data.tokenIcon || data.tokenImg} />
                <LaunchTag type={1} />
            </div>

            <div className={styles.nameContent}>
                <div className={styles.name}>{data.tokenName}</div>
                <div className={styles.trikerContent}>
                    <div className={styles.tickerName}>Ticker: {data.ticker}</div>
                    {/* <img onClick={() => {
                        router.push('/profile/user?account=' + data.account)
                    }} className={styles.createrImg} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" /> */}
                </div>
                <div className={styles.MarketCap}>Market cap: -</div>
                <div className={styles.createTime}>{timeAgo(data.time)}</div>
            </div>
        </div>

        {
            data.status === 0
                ? <div className={styles.actionContent}>
                    <div className={styles.actionItem}>
                        <div className={styles.actionIcon}>
                            <Boost
                                token={data}
                                isGrey={true}
                                onClick={() => {
                                    // onBoost && onBoost();
                                }}
                            />
                        </div>
                        <div className={styles.actionTimes}>
                            <span className={styles.whiteAmount}>{timeFormat || '30 min'}</span>
                        </div>
                    </div>

                    <div className={styles.actionItem}>
                        <div>
                            <SmokeBtn token={data} onClick={() => {
                                // onSuperLike && onSuperLike()
                            }} />
                            <div className={styles.actionTimes}>
                                <span className={styles.whiteAmount}>{data.superLike}</span>
                            </div>
                        </div>
                    </div>
                </div> : <div className={styles.actionContent}>
                    <LauncdedAction data={data} justPlus={true}/>
                </div>
        }

    </div>
}

function LaunchTag({ type }: { type: number }) {
    if (type === 0) {
        return <div className={styles.launchTag + ' ' + styles.launch1}>Pre-Launch</div>
    }

    if (type === 1) {
        return <div className={styles.launchTag + ' ' + styles.launch2}>Luanching</div>
    }
}