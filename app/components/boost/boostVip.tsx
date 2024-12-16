import { useVip } from '@/app/hooks/useVip';
import styles from './boost.module.css'
import BoostIcon from './boostIocn'
import { fail, success } from '@/app/utils/toast';
import { useMemo, useState } from 'react';
import { useAccount } from '@/app/hooks/useAccount';
import MainBtn from '../mainBtn';
import { useUser } from '@/app/store/useUser';
import { formatAddress, formatDateTime } from '@/app/utils';
import type { UserInfo } from '@/app/type';

interface Props {
    onStartVip: () => void;
    onCanceVip: () => void;
}

const defaultAvatar = '/img/avatar.png'
const threeDays = 259200000

export default function BoostVip({
    onStartVip, onCanceVip
}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const { call } = useVip()
    const { userInfo }: any = useUser()

    const { time, vipType } = useMemo(() => {
        if (!userInfo) {
            return {
                time: -1,
                vipType: -1,
            }
        }

        if (userInfo.vipExpirationTime === 0) {
            // never vip
            return {
                time: -1,
                vipType: -1
            }
        } else if (userInfo.vipExpirationTime > 0) {
            const now = Date.now()
            // out date
            if (now > userInfo.vipExpirationTime) {
                return {
                    time: 'Out of date',
                    vipType: 1
                }
            }

            const timeStr = formatDateTime(userInfo.vipExpirationTime, 'yyyy-MM-DD')

            // 3 day left
            if (userInfo.vipExpirationTime - now < threeDays) {
                return {
                    time: timeStr,
                    vipType: 2
                }
            } else {
                return {
                    time: timeStr,
                    vipType: 3
                }
            }
        }

        return {
            time: -1,
            vipType: -1,
        }
    }, [userInfo])

    console.log('time:', time)


    return <div className={styles.vipBox}>
        <div className={styles.vipLogo}>
            <div className={styles.userIcon}>
                <img className={styles.userImg} src={userInfo.icon || defaultAvatar} />
            </div>
            <div className={styles.nameDate}>
                <div className={styles.nameContent}>
                    <div className={styles.name}>{userInfo.name ? userInfo.name : formatAddress(userInfo.address)}</div>
                    {
                        userInfo.vipType === 'vip'
                            ? <img className={styles.vipImg} src="/img/profile/vip.png" />
                            : <img className={styles.vipImg} src="/img/profile/no-vip.png" />
                    }
                </div>
                {
                    vipType === 1 && <div className={styles.date + ' ' + styles.type1}>{time}</div>
                }
                {
                    vipType === 2 && <div className={styles.date + ' ' + styles.type2}>{time}</div>
                }
                {
                    vipType === 3 && <div className={styles.date + ' ' + styles.type3}>{time}</div>
                }

            </div>
        </div>


        <div className={styles.right}>
            <div className={styles.rightItem}>
                <div className={styles.rightTitle}>Rights</div>
                <div className={styles.rightValue}>Like</div>
                <div className={styles.rightValue}>Smoky Hot</div>
                <div className={styles.rightValue}>Boost</div>
            </div>

            <div className={styles.rightItem}>
                <div className={styles.rightTitle}>Free</div>
                <div className={styles.rightValue}>100/D</div>
                <div className={styles.rightValue}>2/D</div>
                <div className={styles.rightValue}>-</div>
            </div>

            <div className={styles.rightItem + ' ' + styles.vipItem}>
                <div className={styles.rightTitle}>VIP</div>
                <div className={styles.rightValue}>200/D</div>
                <div className={styles.rightValue}>6/D</div>
                <div className={styles.rightValue}>2/D</div>
            </div>
        </div>

        {
            vipType === 1 && <div className={styles.timeType1 + ' ' + styles.timeType}>
                *Your VIP has expired
            </div>
        }

        {
            vipType === 2 && <div className={styles.timeType2 + ' ' + styles.timeType}>
                *You have obtained one month VIP
                Continue to purchase can increase the validity of 1 month
            </div>
        }

        {
            vipType === 3 && <div className={styles.timeType3 + ' ' + styles.timeType}>
                *Your VIP is about to expire
                Pre-recharge can ensure the normal use of some functions
            </div>
        }

        <MainBtn isLoading={isLoading} onClick={async () => {
            try {
                setIsLoading(true)
                await call('vip')
                success('Transition success')
                setIsLoading(false)
                onStartVip()
            } catch (e) {
                console.log(e)
                setIsLoading(false)
                fail('Transition fail')
            }
        }} style={{ marginTop: 20 }}>0.02 SOL / Month</MainBtn>
        <div onClick={() => {
            console.log(111)
            onCanceVip()
        }} className={styles.cancelBtn}>No, Thanks</div>
    </div>



}