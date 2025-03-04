import React, { useCallback, useState, useEffect } from 'react'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import { RingChart } from '../copyAmountPie';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/app/components/popover';
import useUserInfo from '@/app/hooks/useUserInfo';
import Big from 'big.js';
import { useCopyTokenInfos } from '@/app/sections/profile/hooks/useCopyTokenInfos';
import { numberFormatter, numberFormatterNew } from '@/app/utils/common';
import { formatAddress } from "@/app/utils";
import { formatLongText } from '@/app/utils/common';
import { formatDateTime } from '@/app/utils/index';
import TokenGroup from '../tokenGroup';
import MainBtn from '@/app/components/mainBtn';

export default function CopyItem({itemInfo, handleCloseCopyTrade, isCloseCopyTradeLoading, urlAddress, handleCloseAndSell, handleClose,}: any) {
    const { userInfo: copyUserInfo } = useUserInfo(itemInfo?.from);
    const tokensInfo = useCopyTokenInfos(itemInfo?.tokens);
    const [showTokenGroup, setShowTokenGroup] = useState(false);
    const commonStyles = {
        borderRadius: '30px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        height: '34px',
        flex: '1',
        fontWeight: '500',
        fontFamily: 'Unbounded',
    }
    const commonStyles2 = {
        background: 'transparent',
        color: '#fff',
        border: '1px solid #FBCA04',
    }
    const commonStyles3 = {
        color: '#000',
    }

    const formatPnl = (pnl: string) => {
      if (pnl == "0") {
        return "0";
      }
      if (pnl.startsWith("-")) {
        return "-" + numberFormatterNew(Math.abs(Number(pnl)), 3, true);
      }
      return "+" + numberFormatterNew(pnl, 3, true);
    };
  
    const formatWinRate = (winRate: string) => {
      if (winRate == "0") {
        return "0%";
      }
      return new Big(winRate).times(100).toFixed(1) + "%";
    };
  
    
    const isGtZero = (str: string) => {
      return Number(str) >= 0;
    };

    const gasFee = 0.01;
    const rentFee = 0.00089088;
    const itemPnl = (itemInfo: any)=>{
      const pnl = new Big(itemInfo?.roi).times(itemInfo.investment + rentFee + gasFee).toString();
      return pnl;
    }

  return (
    <div className={styles.ItemBox}>
      <div className={styles.ItemBoxContent}>
      {/* personal trade info */}
      <div className={styles.PersonalTradeInfoBox}>
        {/* personal info */}
        <div className={styles.PersonalInfo}>
            <img className={styles.Avatar} src={copyUserInfo?.icon  || defaultAvatar} alt="avatar" />
            <div className={styles.Name}>{formatLongText(copyUserInfo?.name) || formatAddress(itemInfo?.from) || 'Flip'}</div>
        </div>
        {/* copy info */}
        <div className={styles.CopyInfo}>
        <Popover
              content={
                <div className={styles.Tooltip}>
                  <p className={styles.TooltipItem}>
                    <span>You deposit</span> 
                    <span className={styles.TooltipItemValue}>
                      {numberFormatter(itemInfo?.investment || 0, 4, true)}
                      <SolIconWithoutBg />
                    </span>
                  </p>
                  <p className={styles.TooltipItem}>
                    <span>Copying</span> 
                    <span className={styles.TooltipItemValue}>
                      {numberFormatter(new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() || 0, 4, true)}
                      <SolIconWithoutBg />
                    </span>
                  </p>
                  <p className={styles.TooltipItem}>
                    <span>Balance</span> 
                    <span className={styles.TooltipItemValue}>
                      {numberFormatter(new Big(itemInfo?.balance).minus(0.00089088).minus(gasFee).toNumber() || 0, 4, true)}
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
                    <span className={styles.CopyAmountTextUseAmount}
                        style={{textDecoration: new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() > 0 ? 'line-through' : 'none'}}
                    >{numberFormatter(new Big(itemInfo?.netWorth).minus(itemInfo?.balance).toNumber() || 0, 4, true)}</span>
                    <span className={styles.CopyAmountTextTotal}>/{numberFormatter(itemInfo?.investment || 0, 4, true)}</span>
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
                        { value: itemInfo?.investment || 0, color: '#515B63', name: 'BALANCE' },
                ]} />
              </div>
        </div>
      </div>
      
      <div className={styles.TradeInfoBox}>
        {/* trade earn */}
        <div className={styles.TradeEarn}>
            <div className={styles.TitlePubStyle}>Copied ROI (PnL) </div>
            <div className={styles.PNLValuePercent}>{Big(itemInfo?.roi).times(100).toString() || 0}%</div>
            <div className={styles.PNLValueUSD}>
              <span style={{color: isGtZero(itemPnl(itemInfo) || '0') ? '#C9FF5D' : '#FF2681'}}>{formatPnl(itemPnl(itemInfo))} SOL</span>
            </div>
        </div>
        {/* coppied tokens */}
        <div className={styles.CoppiedTokens}>
            <div className={styles.TitlePubStyle}>{itemInfo?.tokens?.length || 0} Copied Tokens</div>
            <Popover
   content={
     <div className={styles.Tooltip}>
           {tokensInfo.map((tokenInfo:any, index:number) => {
       return  <p className={styles.TooltipItem} key={index}>
                 <span className={styles.TooltipItemIcon}>
                     <img 
                         key={index} 
                         src={tokenInfo.icon || defaultAvatar} 
                         alt={tokenInfo.symbol || 'token'} 
                         title={tokenInfo.symbol || 'token'}
                     />
                 <span style={{fontSize: '12px'}}>{tokenInfo.symbol || 'token'}</span>
                 </span>
                 <span style={{color: '#fff',marginLeft: '12px', fontSize: '12px'}}>{numberFormatter(tokenInfo.balance || 0, 4, true)}</span>
              </p>
     })}
      
     </div>
   }
   placement={PopoverPlacement.TopLeft}
   trigger={tokensInfo?.length > 0 ? PopoverTrigger.Hover : undefined}
 >
            <div className={styles.TokenIconBox} onClick={() => setShowTokenGroup(true)}>
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
            </Popover>
        </div>
      </div>
      </div>

      {/* actions */}
      <div className={styles.ActionButtonBox}>
        <span className={styles.lastTradeAt}>{formatDateTime(itemInfo?.lastTradeAt)}</span>
       {
        !urlAddress && (
            !itemInfo?.tokens || itemInfo?.tokens?.length === 0 ?
                <button 
                className={styles.ActionButton}
                disabled={itemInfo?.state === 5 || (isCloseCopyTradeLoading && itemInfo?.isClosing)}
                onClick={async () => {
                    itemInfo.isClosing = true;
                        try {
                            await handleClose(itemInfo);
                        } finally {
                            itemInfo.isClosing = false;
                    }
                }}
            >
                    {itemInfo?.state === 5 ? "Closing" : "Close"}
                </button> :
            <Popover
            content={
                <div className={styles.ClosePopoverContent}>
                    <h3>You&apos;re going to close the copy trade,do you want to sell the tokens you copied?</h3>
                    <div className={styles.ClosePopoverButtons}>
                       
                        <MainBtn onClick={() => {
                            handleCloseAndSell(itemInfo);
                        }} style={Object.assign({}, commonStyles, commonStyles2)}>Close and Sell</MainBtn>
                        
                        <MainBtn onClick={() => {
                            handleClose(itemInfo);
                        }} style={Object.assign({}, commonStyles, commonStyles3)}>Just Close</MainBtn>
                    </div>
                </div>
            }
            placement={PopoverPlacement.BottomRight}
            trigger={PopoverTrigger.Click}
           >
          <button 
          className={styles.ActionButton}
          disabled={itemInfo?.state === 5 || (isCloseCopyTradeLoading && itemInfo?.isClosing)}
         >
              {itemInfo?.state === 5 ? "Closing" : "Close"}
          </button>
          </Popover>
        )
       }
      </div>
      <TokenGroup show={showTokenGroup} onClose={() => setShowTokenGroup(false)} copiedInfo={itemInfo} />
    </div>
  )
}



const SolIconWithoutBg = () => {
    return (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.875 0H11.25L9.375 2.5H0L1.875 0ZM1.875 7.5H11.25L9.375 10H0L1.875 7.5ZM11.25 6.25H1.875L0 3.75H9.375L11.25 6.25Z" fill="#9290B1"/>
     </svg> )   
}