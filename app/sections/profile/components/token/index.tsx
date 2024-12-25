import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './token.module.css'
import { DotLoading, Modal } from 'antd-mobile'
import BoostJust from '@/app/components/boost/boostJust'
import type { Project } from '@/app/type'
import { timeAgo } from '@/app/utils'
import SmokeBtn from '@/app/components/smokHot'
import { useRouter } from 'next/navigation'
import Boost from '@/app/components/boost'
import useTimeLeft from '@/app/hooks/useTimeLeft'
import LauncdedAction from '@/app/components/action/launched'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import { fail, success } from '@/app/utils/toast'

interface Props {
    data: Project;
    update: () => void;
    prepaidWithdrawDelayTime: number;
    hideHot?: boolean;
    from?: string;
}

export default function Token({ data, update, prepaidWithdrawDelayTime, hideHot, from }: Props) {
    const router = useRouter()
    const { timeFormat } = useTimeLeft({ time: data.boostTime })
    const [isPrepaid, setIsPrepaid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updateNum, setUpdateNum] = useState(1)
    const [isClaimed, setIsClaimed] = useState(false)
    const [isWithdrawed, setIsWithdrawed] = useState(false)

    const { prepaidSolWithdraw, prepaidTokenWithdraw, checkPrePayed } = useTokenTrade({
        tokenName: data.tokenName,
        tokenSymbol: data.tokenSymbol as string,
        tokenDecimals: data.tokenDecimals as number,
        loadData: false
    })

    const isDelay = useMemo(() => {
        if (prepaidWithdrawDelayTime && data.createdAt && Date.now() - data.createdAt > prepaidWithdrawDelayTime) {
            return true
        }
        return false
    }, [prepaidWithdrawDelayTime, data])

    useEffect(() => {
        checkPrePayed().then(res => {
            if (Number(res) > 0) {
                setIsPrepaid(true)
            }
        })
    }, [updateNum])


    return <div className={`${styles.main} ${from === "page" && styles.PageToken}`}>
        <div className={styles.tokenMag}>
            <div className={styles.tokenImgContent} onClick={() => {
                router.push('/detail?id=' + data.id)
            }}>
                <img className={styles.tokenImg} src={data.tokenIcon || data.tokenImg} />
                <LaunchTag type={data.status as number} />
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
                ? (
                    isDelay ? <div className={styles.actionContent}>
                        <div className={styles.actionItem}>
                            {
                                isPrepaid && (isWithdrawed ? <div className={ styles.withdrawGrey }>Withdraw</div> : <div className={styles.withdraw} onClick={async () => {
                                    setIsLoading(true)
                                    const res = await prepaidSolWithdraw()

                                    if (!res) {
                                        fail('Withdraw fail')
                                    } else {
                                        success('Withdraw success')
                                        setIsWithdrawed(true)
                                    }
                                    setIsLoading(false)
                                }}>{isLoading ? <DotLoading /> : 'Withdraw'}</div>)
                            }
                        </div>
                    </div> : <div className={styles.actionContent}>
                        <div className={styles.actionItem}>
                            <div className={styles.actionIcon}>
                                <Boost
                                    token={data}
                                    isGrey={true}
                                    onClick={() => {
                                        update && update()
                                    }}
                                />
                            </div>
                            <div className={styles.actionTimes}>
                                {
                                    timeFormat ? <div className={styles.whiteAmount}>
                                        <div className={styles.timeFormat}>{timeFormat}</div>
                                    </div> : <div style={{ transform: 'translateX(-30%)' }}></div>
                                }
                            </div>
                        </div>

                        {
                            !hideHot && <div className={styles.actionItem}>
                                <div>
                                    <SmokeBtn token={data} onClick={() => {
                                        update && update()
                                    }} />
                                    <div className={styles.actionTimes}>
                                        <span className={styles.whiteAmount}>{data.superLike}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                ) : <div className={styles.actionContent}>
                    {
                        isPrepaid && (isClaimed ? <div className={styles.withdrawGrey}>Claimed</div> : <div className={styles.withdraw} onClick={async () => {
                            setIsLoading(true)
                            const res = await prepaidTokenWithdraw()
                            if (!res) {
                                fail('Claim fail')
                            } else {
                                success('Claim success')
                                setIsClaimed(true)
                            }
                            setIsLoading(false)
                        }}>{isLoading ? <DotLoading /> : 'Claim'}</div>)
                    }
                    <LauncdedAction data={data} justPlus={true} />
                </div>
        }

    </div>
}

function LaunchTag({ type }: { type: number }) {
    if (type === 0) {
        return <div className={styles.launchTag + ' ' + styles.launch1}>Pre-Launch</div>
    }

    if (type === 1) {
        return <div className={styles.launchTag + ' ' + styles.launch2}>Launching</div>
    }
}