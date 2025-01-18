import React from 'react'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import { RingChart } from '../copyAmountPie';

const SolIconWithoutBg = () => {
    return (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.875 0H11.25L9.375 2.5H0L1.875 0ZM1.875 7.5H11.25L9.375 10H0L1.875 7.5ZM11.25 6.25H1.875L0 3.75H9.375L11.25 6.25Z" fill="#9290B1"/>
     </svg> )   
}

export default function CopyItem({itemInfo}: any) {
  return (
    <div className={styles.ItemBox}>
      
      {/* personal trade info */}
      <div className={styles.PersonalTradeInfoBox}>
        {/* personal info */}
        <div className={styles.PersonalInfo}>
            <img className={styles.Avatar} src={itemInfo?.avatar || defaultAvatar} alt="avatar" />
            <div className={styles.Name}>@{itemInfo?.name || 'Flip'}</div>
        </div>
        {/* copy info */}
        <div className={styles.CopyInfo}>
            <div className={styles.CopyAmount}>
                <p className={styles.CopyAmountText}>
                    <span className={styles.CopyAmountTextUseAmount}>{itemInfo?.useAmount || 0}</span>
                    <span className={styles.CopyAmountTextTotal}>/{itemInfo?.totalAmount || 0}</span>
                </p>
                <SolIconWithoutBg />
            </div>
            <div className={styles.TooltipContainer}>
                <RingChart data={itemInfo?.chartData || [
                        { value: 30, color: '#C9FF5D' },
                        { value: 45, color: '#515B63' },
                ]} />
                <div className={styles.Tooltip}>
                    <p className={styles.TooltipItem}>
                        <span>You deposit</span> 
                        <span className={styles.TooltipItemValue}>
                            {itemInfo?.useAmount || 0}
                            <SolIconWithoutBg />
                        </span>
                    </p>
                    <p className={styles.TooltipItem}>
                        <span>Coppied</span> 
                        <span className={styles.TooltipItemValue}>
                            {itemInfo?.totalAmount || 0}
                            <SolIconWithoutBg />
                        </span>
                    </p>
                    <p className={styles.TooltipItem}>
                        <span>Balance</span> 
                        <span className={styles.TooltipItemValue}>
                            {itemInfo?.balance || 0}
                            <SolIconWithoutBg />
                        </span>
                    </p>
                </div>
            </div>
        </div>
      </div>
      
      <div className={styles.TradeInfoBox}>
        {/* trade earn */}
        <div className={styles.TradeEarn}>
            <div className={styles.TitlePubStyle}>Coppied ROI (PNL) </div>
            <div className={styles.PNLValuePercent}>{itemInfo?.pnl || 0}%</div>
            <div className={styles.PNLValueUSD}>+${itemInfo?.pnlIncrease || 0}</div>
        </div>
        {/* coppied tokens */}
        <div className={styles.CoppiedTokens}>
            <div className={styles.TitlePubStyle}>{itemInfo?.coppiedTokens?.length || 5} Coppied Tokens</div>
            <div className={styles.TokenIconBox}>
               {
                (itemInfo?.coppiedTokens || [1,2,3,4,5])?.slice(0, 5).map((token: any, index: number) => {
                    if (index === 4) {
                        return <div key={index} className={styles.MoreTokens}>...</div>
                    }
                    if (index < 4) {
                        return <img key={index} src={token?.icon || defaultAvatar} alt="token" />
                    }
                })
               }
            </div>
        </div>
      </div>
    </div>
  )
}
