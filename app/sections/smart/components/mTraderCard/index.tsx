import React from 'react'
import styles from './index.module.css'
import { CopyierIconBlack, ClaimIcon } from '@/app/sections/trends/components/top-traders/icon'
import RightArrowWrap from '@/app/sections/smart/components/RightArrowWrap'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/store/useUser';
export default function TopTraderCard() {
  const router = useRouter();
  const { userInfo } = useUser();
  return (
    <div className={styles.container}>
      {/* title & copyier amount */}
      <div className={styles.titleContainer}>
        <div className={styles.title}>
            <span>You’re A Top Trader</span>
              <div onClick={() => router.push(`/smartTopDetail?address=${userInfo?.address}`)}>
              <RightArrowWrap />
            </div>
        </div>
        <span className={styles.copyierAmount}>
            <CopyierIconBlack />
            <span className={styles.copyierAmountValue}>0</span>
        </span>
      </div>

      {/* claim amount */}
      <div className={styles.claimAmountContainer}>
        <div className={styles.claimAmountDetails}>
            <h3 className={styles.claimAmountDetailsTitle}>Your Profit Share</h3>
            <p className={styles.claimAmountValueContainer}>
                <span className={styles.claimAmountValue}>0</span>
                <span className={styles.claimAmountCurrency}>SOL</span>
            </p>
        </div>
        <div className={styles.claimAmountButton}>
            <ClaimIcon />
            <span className={styles.claimAmountButtonText}>Claim</span>
        </div>
      </div>
    </div>
  )
}
