import React from 'react'
import styles from './index.module.css'
import { CopyierIconBlack, ClaimIcon } from '@/app/sections/trends/components/top-traders/icons'
import RightArrowWrap from '@/app/sections/smart/components/RightArrowWrap'
import {useRouter} from 'next/navigation'
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { numberFormatter } from '@/app/utils/common';


export default function CopyTradeCard(props: {smartMoniesInfo: SmartMoneyAddress | null, copyTradersUserInfo: CopyTraderAddress | null}) {
  const router = useRouter();
  const { smartMoniesInfo, copyTradersUserInfo } = props;
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>Copied PRFM</span>
        <div
          onClick={() => {
            router.push("/smartDetail");
          }}
        >
          <RightArrowWrap />
        </div>
      </div>

        <div className={styles.copyDetails}>
            <div className={styles.totalPnl}>
              <span className={styles.detailTitle}>Total PNL</span>
              <span className={styles.detailValueContainer}>
                <span className={styles.detailValue}>
                  {numberFormatter(copyTradersUserInfo?.tradeInfo?.totalPNL || 0, 4, true) || '0'}
                </span>
                <span className={styles.detailValueCurrency}>SOL</span>
              </span>
            </div>
            <div className={styles.openPosition}>
              <span className={styles.detailTitle}>Open Position</span>
              <span className={styles.detailValueContainer}>
                <span className={styles.detailValueCurrent}>{numberFormatter(copyTradersUserInfo?.tradeInfo?.currentPNL || 0, 4, true) || '0'}</span>
                <span className={styles.detailValue}>/ {copyTradersUserInfo?.tradeInfo?.tokenPosition}</span>
                <span className={styles.detailValueCurrency}>SOL</span>
              </span>
            </div>
        </div>
        <div className={styles.openPosition}>
          <span className={styles.detailTitle}>Open Position</span>
          <span className={styles.detailValueContainer}>
            <span className={styles.detailValueCurrent}>0</span>
            <span className={styles.detailValue}>/ 0</span>
            <span className={styles.detailValueCurrency}>SOL</span>
          </span>
        </div>
      </div>
  );
}
