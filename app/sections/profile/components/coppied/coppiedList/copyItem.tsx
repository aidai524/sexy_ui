import React, { useCallback, useState, useEffect } from 'react'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import { RingChart } from '../copyAmountPie';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/app/components/popover';
import useUserInfo from '@/app/hooks/useUserInfo';
import Big from 'big.js';
import { useCopyTokenInfos } from '@/app/sections/profile/hooks/useCopyTokenInfos';

export default function CopyItem({itemInfo, handleCloseCopyTrade, isCloseCopyTradeLoading}: any) {
    const { userInfo: copyUserInfo } = useUserInfo(itemInfo?.from);
    const tokensInfo = useCopyTokenInfos(itemInfo?.tokens);


  return (
    <div className={styles.ItemBox}>
      <div className={styles.ItemBoxContent}>
      {/* personal trade info */}
      <div className={styles.PersonalTradeInfoBox}>
        {/* personal info */}
        <div className={styles.PersonalInfo}>
            <img className={styles.Avatar} src={copyUserInfo?.icon  || defaultAvatar} alt="avatar" />
            <div className={styles.Name}>@{copyUserInfo?.name || itemInfo?.from  || 'Flip'}</div>
        </div>
        {/* copy info */}
        <div className={styles.CopyInfo}>
        <Popover
              content={
                <div className={styles.Tooltip}>
                  <p className={styles.TooltipItem}>
                    <span>You deposit</span> 
                    <span className={styles.TooltipItemValue}>
                      {itemInfo?.investment || 0}
                      <SolIconWithoutBg />
                    </span>
                  </p>
                  <p className={styles.TooltipItem}>
                    <span>Coppied</span> 
                    <span className={styles.TooltipItemValue}>
                      {new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() || 0}
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
              }
              placement={PopoverPlacement.TopLeft}
              trigger={PopoverTrigger.Hover}
            >
            <div className={styles.CopyAmount}>
                <p className={styles.CopyAmountText}>
                    <span className={styles.CopyAmountTextUseAmount}>{new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() || 0}</span>
                    <span className={styles.CopyAmountTextTotal}>/{(+itemInfo?.balance || 0).toFixed(6)}</span>
                </p>
                <SolIconWithoutBg />
            </div>
            </Popover>
              <div>
                <RingChart data={[
                        { value: 
                            new Big(itemInfo?.netWorth).minus(itemInfo?.balance).gte(0) ? 
                            new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() : 0, 
                            color: '#C9FF5D', name: 'USED' 
                        },
                        { value: itemInfo?.balance || 0, color: '#515B63', name: 'BALANCE' },
                ]} />
              </div>
        </div>
      </div>
      
      <div className={styles.TradeInfoBox}>
        {/* trade earn */}
        <div className={styles.TradeEarn}>
            <div className={styles.TitlePubStyle}>Coppied ROI (PNL) </div>
            <div className={styles.PNLValuePercent}>{Big(itemInfo?.roi).times(100).toString() || 0}%</div>
            <div className={styles.PNLValueUSD}>${Big(itemInfo?.pnl).toString() || 0}</div>
        </div>
        {/* coppied tokens */}
        <div className={styles.CoppiedTokens}>
            <div className={styles.TitlePubStyle}>{itemInfo?.tokens?.length || 0} Coppied Tokens</div>
            <div className={styles.TokenIconBox}>
               {tokensInfo.map((tokenInfo:any, index:number) => {
                    if (index === 4) {
                        return <div key={index} className={styles.MoreTokens}>...</div>
                    }
                    if (index < 4) {
                        return <img 
                            key={index} 
                            src={tokenInfo.icon || defaultAvatar} 
                            alt={tokenInfo.symbol || 'token'} 
                            title={tokenInfo.symbol || 'token'}
                        />
                    }
                })}
            </div>
        </div>
      </div>
      </div>

      {/* actions */}
      <div className={styles.ActionButtonBox}>
        <button 
            className={styles.ActionButton}
            disabled={itemInfo?.state === 5 || (isCloseCopyTradeLoading && itemInfo?.isClosing)}
            onClick={async () => {
                itemInfo.isClosing = true;
                try {
                    await handleCloseCopyTrade(itemInfo);
                } finally {
                    itemInfo.isClosing = false;
                }
            }}
           >
                {itemInfo?.state === 5 ? "Closing" : "Close"}
            </button>
      </div>
    </div>
  )
}


const SolIconWithoutBg = () => {
    return (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.875 0H11.25L9.375 2.5H0L1.875 0ZM1.875 7.5H11.25L9.375 10H0L1.875 7.5ZM11.25 6.25H1.875L0 3.75H9.375L11.25 6.25Z" fill="#9290B1"/>
     </svg> )   
}