import type { Project } from '@/app/type';
import styles from './index.module.css'
import Boost from '@/app/components/boost';
import SmokeHot from '@/app/components/smokHot';
import { useTokenTrade } from '@/app/hooks/useTokenTrade';
import { useEffect, useMemo, useState } from 'react';
import { fail, success } from '@/app/utils/toast';
import { DotLoading } from 'antd-mobile';
import BuySell from './buySell';
import { useUser } from '@/app/store/useUser';


interface Props {
    token: Project;
    isOther: boolean;
    prepaidWithdrawDelayTime: number;
}

export default function ActionList({
    token,
    isOther,
    prepaidWithdrawDelayTime
}: Props) {
    const [isPrepaid, setIsPrepaid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updateNum, setUpdateNum] = useState(1)
    const [isClaimed, setIsClaimed] = useState(false)
    const [isWithdrawed, setIsWithdrawed] = useState(false)
    const { userInfo }: any = useUser()

    const { prepaidSolWithdraw, prepaidTokenWithdraw, checkPrePayed } = useTokenTrade({
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol as string,
        tokenDecimals: token.tokenDecimals as number,
        loadData: false
    })

    const isDelay = useMemo(() => {
        if (prepaidWithdrawDelayTime && token.createdAt && Date.now() - token.createdAt > prepaidWithdrawDelayTime) {
            console.log('Date.now() - token.createdAt', Date.now() - token.createdAt, prepaidWithdrawDelayTime)

            return true
        }
        return false
    }, [prepaidWithdrawDelayTime, token])

    useEffect(() => {
        if (isOther) {
            setIsPrepaid(false)
            return 
        }
        checkPrePayed().then(res => {
            if (Number(res) > 0) {
                setIsPrepaid(true)
            }
        })
    }, [updateNum, isOther])

    const disableSmooke = useMemo(() => {
        return token.isSuperLike || token.account === userInfo.address
    }, [])

    return <div className={styles.actionbox}>
        {
            token.status === 0 && <>
                {
                    isDelay && !isOther
                    && <>{
                        isPrepaid && (isWithdrawed ? <div className={styles.actionBtn + ' ' + styles.isGrey}>Withdrawed</div> : <div className={styles.actionBtn} onClick={async () => {
                            setIsLoading(true)
                            try {
                                const res = await prepaidSolWithdraw()

                                if (!res) {
                                    fail('Withdraw fail')
                                } else {
                                    success('Withdraw success')
                                    setIsWithdrawed(true)
                                }
                            } catch (e) {
                                console.log(e)
                                fail('Withdraw fail')
                            }

                            setIsLoading(false)
                        }}>{isLoading ? <DotLoading /> : 'Withdraw'}</div>)
                    }</>
                }

                <>
                    {/* <Boost actionChildren={<div className={styles.actionBtn}>
                        <BoostIcon />
                        Boost
                    </div>} token={token} onClick={() => { }} /> */}
                    {
                        !disableSmooke && <SmokeHot actionChildren={<div className={styles.actionBtn}>
                            <SmookIcon />
                            Flip
                        </div>} token={token} onClick={() => { }} />
                    }
                </>
            </>
        }

        {
            token.status === 1 && <>
                {
                    isPrepaid && !isOther && (isClaimed ? <div className={styles.actionBtn + ' ' + styles.isGrey}>Claimed</div> : <div className={styles.actionBtn} onClick={async () => {
                        setIsLoading(true)
                        try {
                            const res = await prepaidTokenWithdraw()
                            if (!res) {
                                fail('Claim fail')
                            } else {
                                success('Claim success')
                                setIsClaimed(true)
                            }
                        } catch (e) {
                            console.log(e)
                            fail('Claim fail')
                        }

                        setIsLoading(false)
                    }}>{isLoading ? <DotLoading /> : 'Claim'}</div>)
                }

                <>
                    <BuySell token={token} />
                </>
            </>
        }

    </div>
}

function BoostIcon() {
    return <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.9153 0.274608C10.5529 0.399279 10.9624 0.992949 10.8274 1.59849L9.1247 9.30433L14.1503 10.692C14.28 10.7274 14.4027 10.7841 14.5134 10.8597C14.6378 10.9424 14.7438 11.0493 14.8249 11.1739C14.906 11.2985 14.9605 11.4382 14.9851 11.5844C15.0097 11.7306 15.0038 11.8802 14.9678 12.0241C14.9319 12.168 14.8666 12.3031 14.7759 12.4211L6.28335 23.5376C6.14516 23.714 5.95973 23.8486 5.7481 23.926C5.53648 24.0034 5.30716 24.0205 5.0862 23.9754C4.44862 23.8492 4.03906 23.2571 4.17258 22.6515L5.8753 14.9442L0.849662 13.5565C0.719145 13.5209 0.59613 13.463 0.486616 13.3888C0.362241 13.3061 0.256243 13.1993 0.175128 13.0746C0.0940125 12.95 0.03949 12.8103 0.0149061 12.6641C-0.00967771 12.5179 -0.00380442 12.3683 0.0321657 12.2244C0.0681358 12.0805 0.133444 11.9454 0.224083 11.8274L8.71815 0.71244C8.85634 0.535992 9.04177 0.401426 9.25339 0.32403C9.46502 0.246634 9.69434 0.229511 9.9153 0.274608Z" fill="#00FFEE" />
    </svg>
}

function SmookIcon() {
    return <img src="/img/profile/smoke-action.svg"/>
}