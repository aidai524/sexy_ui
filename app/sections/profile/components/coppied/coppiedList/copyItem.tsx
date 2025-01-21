import React, { useCallback } from 'react'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import { RingChart } from '../copyAmountPie';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/app/components/popover';
import useUserInfo from '@/app/hooks/useUserInfo';
import { getTokenMeta } from '@/app/utils/solanaScanApi';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Big from 'big.js';

export default function CopyItem({itemInfo}: any) {
    const { connection } = useConnection();
    const { userInfo: copyUserInfo } = useUserInfo(itemInfo?.from);
    const getTokenInfo = async (address: string) => {
        try {
            if (process.env.NEXT_PUBLIC_NET === "Devnet") {
                const tokenSupply = await connection.getTokenSupply(
                    new PublicKey(address),
                    "confirmed"
                );
                return {
                    supply: tokenSupply.value.uiAmount || 0,
                    icon: defaultAvatar,
                    symbol: 'token'
                };
            } else {
                const tokenInfo = await getTokenMeta(address);
                return {
                    supply: tokenInfo.data.supply,
                    icon: tokenInfo.data.icon || defaultAvatar,
                    symbol: tokenInfo.data.symbol || 'token'
                };
            }
        } catch (error) {
            return {
                supply: 0,
                icon: defaultAvatar,
                symbol: 'token'
            };
        }
    };

  return (
    <div className={styles.ItemBox}>
      
      {/* personal trade info */}
      <div className={styles.PersonalTradeInfoBox}>
        {/* personal info */}
        <div className={styles.PersonalInfo}>
            <img className={styles.Avatar} src={copyUserInfo?.icon  || defaultAvatar} alt="avatar" />
            <div className={styles.Name}>@{copyUserInfo?.name || itemInfo?.from  || 'Flip'}</div>
        </div>
        {/* copy info */}
        <div className={styles.CopyInfo}>
            <div className={styles.CopyAmount}>
                <p className={styles.CopyAmountText}>
                    <span className={styles.CopyAmountTextUseAmount}>{new Big(itemInfo?.investment).minus(itemInfo?.balance).toNumber() || 0}</span>
                    <span className={styles.CopyAmountTextTotal}>/{(+itemInfo?.balance || 0).toFixed(2)}</span>
                </p>
                <SolIconWithoutBg />
            </div>
            <Popover
              content={
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
                      {new Big(itemInfo?.investment).minus(itemInfo?.balance).toNumber() || 0}
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
              <div>
                <RingChart data={[
                        { value: 
                            new Big(itemInfo?.investment).minus(itemInfo?.balance).lte(0) ? 
                            new Big(itemInfo?.investment).minus(itemInfo?.balance).toNumber() : 0, 
                            color: '#C9FF5D', name: 'USED' 
                        },
                        { value: itemInfo?.balance || 0, color: '#515B63', name: 'BALANCE' },
                ]} />
              </div>
            </Popover>
        </div>
      </div>
      
      <div className={styles.TradeInfoBox}>
        {/* trade earn */}
        <div className={styles.TradeEarn}>
            <div className={styles.TitlePubStyle}>Coppied ROI (PNL) </div>
            <div className={styles.PNLValuePercent}>{itemInfo?.roi * 100 || 0}%</div>
            <div className={styles.PNLValueUSD}>${itemInfo?.pnl || 0}</div>
        </div>
        {/* coppied tokens */}
        <div className={styles.CoppiedTokens}>
            <div className={styles.TitlePubStyle}>{itemInfo?.tokens?.length || 0} Coppied Tokens</div>
            <div className={styles.TokenIconBox}>
               {
                (itemInfo?.tokens || [])?.slice(0, 5).map((item: any, index: number) => {
                    const tokenInfo:any = getTokenInfo(item.token);
                    if (index === 4) {
                        return <div key={index} className={styles.MoreTokens}>...</div>
                    }
                    if (index < 4) {
                        return <img key={index} src={tokenInfo?.icon || defaultAvatar} alt={tokenInfo?.symbol || 'token'} />
                    }
                })
               }
            </div>
        </div>
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