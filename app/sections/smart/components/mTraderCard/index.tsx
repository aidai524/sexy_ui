import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { CopyierIconBlack, ClaimIcon } from '@/app/sections/trends/components/top-traders/icons'
import RightArrowWrap from '@/app/sections/smart/components/RightArrowWrap'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/store/useUser';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { useAccount } from '@/app/hooks/useAccount';
import { useUserAgent } from "@/app/context/user-agent";
import { useWithdrawClaim } from '@/app/sections/profile/hooks/useWithdrawClaim';
import Big from 'big.js';
import { numberFormatterNew } from '@/app/utils/common'
export default function TopTraderCard(props: {smartMoniesInfo: SmartMoneyAddress | null, copyTradersUserInfo: CopyTraderAddress | null, setRefreshing: (refreshing: number) => void, refreshing: number}) {
  const router = useRouter();
  const { handleWithdrawClaim } = useWithdrawClaim();
  const { isMobile } = useUserAgent();
  const { userInfo } = useUser();
  const { address: walletAddress } = useAccount();
  const { smartMoniesInfo, copyTradersUserInfo, setRefreshing, refreshing } = props;
  const [canClaim, setCanClaim] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCanClaim(
      numberFormatterNew(new Big(copyTradersUserInfo?.carryFee || "0").minus(
        new Big(copyTradersUserInfo?.claimed || "0")
      ).toNumber(), 3, true)
    );
  }, [copyTradersUserInfo]);

  const claimProfit = async () => {
    if (!walletAddress || copyTradersUserInfo?.isClaiming || isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await handleWithdrawClaim({
        amount: canClaim.toString(),
        chain: 'solana',
        walletAddress,
      });
    if (res) {
      setCanClaim(0);
        setRefreshing(refreshing + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={`
      ${isMobile ? styles.container : styles.containerPC}
      ${!isMobile ? styles.fontWeight700 : ''}
    `.trim()}>
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
          <div className={styles.claimAmountButton} onClick={claimProfit}>
            <ClaimIcon />
           {isLoading ?    
              <span className={styles.claimAmountButtonText}>
                 Loading
                </span> : 
                <span className={styles.claimAmountButtonText}>
                  { copyTradersUserInfo?.isClaiming ? 'Claiming' : 'Claim' }
                </span>
              }
          </div>
        )}
      </div>
    </div>
  );
}
