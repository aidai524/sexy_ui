import React from 'react'
import styles from './index.module.css'
import { CopyierIconBlack, ClaimIcon } from '@/app/sections/trends/components/top-traders/icons'
import RightArrowWrap from '@/app/sections/smart/components/RightArrowWrap'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/store/useUser';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { useAccount } from '@/app/hooks/useAccount';
import { useUserAgent } from "@/app/context/user-agent";
export default function TopTraderCard(props: {smartMoniesInfo: SmartMoneyAddress | null, copyTradersUserInfo: CopyTraderAddress | null}) {
  const router = useRouter();
  const { isMobile } = useUserAgent();
  const { userInfo } = useUser();
  const { address: walletAddress } = useAccount();
  const { smartMoniesInfo, copyTradersUserInfo } = props;
  const canClaim =
    Number(copyTradersUserInfo?.carryFee || "0") -
    Number(copyTradersUserInfo?.claimed || "0");
  return (
    <div className={isMobile ? styles.container : styles.containerPC}>
      {/* title & copyier amount */}
      <div className={styles.titleContainer}>
        <div className={styles.title}>
            <span>You&apos;re A Top Trader</span>
              <div style={{cursor: 'pointer'}} onClick={() => router.push(`/smartTopDetail?address=${userInfo?.address || walletAddress}`)}>
              <RightArrowWrap />
            </div>
        </div>
        <span className={styles.copyierAmount}>
          <CopyierIconBlack />
          <span className={styles.copyierAmountValue}>
            {copyTradersUserInfo?.copied || 0}
          </span>
        </span>
      </div>

      {/* claim amount */}
      <div className={styles.claimAmountContainer}>
        <div className={styles.claimAmountDetails}>
          <h3 className={styles.claimAmountDetailsTitle}>Your Profit Share</h3>
          <p className={styles.claimAmountValueContainer}>
            <span className={styles.claimAmountValue}>{canClaim}</span>
            <span className={styles.claimAmountCurrency}>SOL</span>
          </p>
        </div>
        {canClaim > 0 && (
          <div className={styles.claimAmountButton}>
            <ClaimIcon />
            <span className={styles.claimAmountButtonText}>Claim</span>
          </div>
        )}
      </div>
    </div>
  );
}
