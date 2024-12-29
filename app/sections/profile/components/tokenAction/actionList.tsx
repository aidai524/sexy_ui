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
    prepaidWithdrawDelayTime: number;
}

export default function ActionList({
    token,
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
        checkPrePayed().then(res => {
            if (Number(res) > 0) {
                setIsPrepaid(true)
            }
        })
    }, [updateNum])

    const disableSmooke = useMemo(() => {
        return token.isSuperLike || token.account === userInfo.address
    }, [])

    return <div className={styles.actionbox}>
        {
            token.status === 0 && <>
                {
                    isDelay
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
                            Smoky Hot
                        </div>} token={token} onClick={() => { }} />
                    }
                </>
            </>
        }

        {
            token.status === 1 && <>
                {
                    isPrepaid && (isClaimed ? <div className={styles.actionBtn + ' ' + styles.isGrey}>Claimed</div> : <div className={styles.actionBtn} onClick={async () => {
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
    return <svg width="22" height="27" viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0104361 14.995C-0.123598 12.9844 1.00804 8.86435 4.88137 6.32484C5.12383 6.16588 5.44216 6.32618 5.48697 6.61261C5.71035 8.04043 6.15428 8.96752 6.93185 9.73319C7.03714 9.83686 7.19383 9.86665 7.33167 9.81344C10.3915 8.63235 12.7746 6.25571 11.9299 0.461675C11.8833 0.141896 12.2045 -0.10801 12.4879 0.047383C15.978 1.96147 22.0924 7.51647 21.9989 14.995C21.9989 23.4906 15.0026 26.3891 10.8048 26.3891C6.60698 26.3891 0.0104361 23.0908 0.0104361 14.995ZM4.61285 13.5478C4.15361 14.2395 3.9083 15.0545 3.90832 15.8884C3.90778 16.4943 4.03709 17.0931 4.28729 17.6433C4.53749 18.1936 4.90261 18.6821 5.35738 19.0751L9.9132 23.133C10.1664 23.3586 10.4906 23.4854 10.8276 23.4907C11.1646 23.4961 11.4925 23.3796 11.7526 23.1623L16.4299 19.2541C16.9495 18.8654 17.3714 18.3582 17.6617 17.7735C17.952 17.1888 18.1025 16.543 18.1009 15.8884C18.1009 15.0545 17.8556 14.2395 17.3964 13.5478C16.9371 12.856 16.2848 12.3189 15.5229 12.0051C14.7609 11.6913 13.924 11.6151 13.1191 11.7863C12.5862 11.8997 12.0833 12.118 11.6379 12.4262C11.264 12.6848 10.7452 12.6848 10.3713 12.4262C9.92587 12.118 9.42304 11.8997 8.89011 11.7863C8.08523 11.6151 7.2483 11.6913 6.48636 12.0051C5.72441 12.3189 5.0721 12.856 4.61285 13.5478ZM9.00422 15.1502C9.17787 15.0591 9.36525 15.2465 9.27411 15.4201L8.80495 16.3141C8.77442 16.3722 8.77442 16.4417 8.80495 16.4999L9.27411 17.3938C9.36525 17.5675 9.17787 17.7548 9.00422 17.6637L8.11028 17.1945C8.05211 17.164 7.98266 17.164 7.92449 17.1945L7.03055 17.6637C6.8569 17.7548 6.66952 17.5675 6.76066 17.3938L7.22982 16.4999C7.26035 16.4417 7.26035 16.3722 7.22982 16.3141L6.76066 15.4201C6.66952 15.2465 6.8569 15.0591 7.03055 15.1502L7.92449 15.6194C7.98266 15.6499 8.05211 15.6499 8.11028 15.6194L9.00422 15.1502ZM15.471 15.4201C15.5622 15.2465 15.3748 15.0591 15.2011 15.1502L14.3072 15.6194C14.249 15.6499 14.1796 15.6499 14.1214 15.6194L13.2275 15.1502C13.0538 15.0591 12.8664 15.2465 12.9576 15.4201L13.4267 16.3141C13.4573 16.3722 13.4573 16.4417 13.4267 16.4999L12.9576 17.3938C12.8664 17.5675 13.0538 17.7548 13.2275 17.6637L14.1214 17.1945C14.1796 17.164 14.249 17.164 14.3072 17.1945L15.2011 17.6637C15.3748 17.7548 15.5622 17.5675 15.471 17.3938L15.0019 16.4999C14.9713 16.4417 14.9713 16.3722 15.0019 16.3141L15.471 15.4201Z" fill="url(#paint0_linear_5011_3019)" />
        <defs>
            <linearGradient id="paint0_linear_5011_3019" x1="11" y1="0" x2="11" y2="26.3891" gradientUnits="userSpaceOnUse">
                <stop stop-color="#D9ABFF" />
                <stop offset="1" stop-color="#B65AFF" />
            </linearGradient>
        </defs>
    </svg>


}