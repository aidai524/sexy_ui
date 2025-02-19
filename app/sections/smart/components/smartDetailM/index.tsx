import React from 'react'
import styles from './index.module.css'
import { LeftBackIcon, ShareIcon } from '@/app/sections/trends/components/top-traders/icon'
import { useUser } from '@/app/store/useUser';
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress} from "@/app/utils";
import { formatLongText } from '@/app/utils/common';
import { useUserAgent } from '@/app/context/user-agent'
import { useRouter } from 'next/navigation';
import Coppied from '@/app/sections/smart/components/coppied';
export default function SmartDetailM() {
    const { userInfo } = useUser();
    const { isMobile } = useUserAgent();
    const router = useRouter();
  return (
    <div className={styles.container}>
        {/*  */}
        <div className={styles.back}>
            <div onClick={() => router.back()}>
                <LeftBackIcon />
            </div>
            <div className={styles.userInfo}>
                <img
                    className={styles.avatar}
                    src={userInfo?.icon || defaultAvatar}
                    alt=""
                    />
                <div className={styles.userName}>
                { formatLongText(userInfo?.name)  || formatAddress(userInfo?.address) || "FlipN"}
                </div>
            </div>
            <div>
                <ShareIcon />
            </div>
        </div>
        {/*  */}
        <SmartDetailContent />
        {/* copy list */}
        <Coppied isOther={false}/>
    </div>
  )
}


export const SmartDetailContent = () => {
    return (
        <div className={styles.smartDetailContent}>
           <h3 className={styles.smartDetailContentTitle}>Copied PRFM</h3>
           <div className={styles.statsContainer}>
            <div className={styles.statsRow}>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Total PnL</div>
                    <div className={styles.statValueBig}>
                        <span className={styles.highlight}>100.2</span> 
                        <span className={styles.detailValueCurrency}>SOL</span>
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>ROI</div>
                    <div className={styles.statValue}>235.5%</div>
                </div>
            </div>
            <div className={styles.statsRow}>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Copy Trade Count</div>
                    <div className={styles.statValue}>10</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Win Rate</div>
                    <div className={styles.statValue}>90.2%</div>
                </div>
            </div>
            <div className={styles.statsRow}>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Open Position</div>
                    <div className={styles.statValue}>35.5 SOL</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Current PnL</div>
                    <div className={styles.statValue}>
                        <span className={styles.highlight}>36.5</span> 
                        <span className={styles.detailValueCurrency}>SOL</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
}