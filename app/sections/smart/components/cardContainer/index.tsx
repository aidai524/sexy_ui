import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import TopTraderCard from '@/app/sections/smart/components/mTraderCard'
import CopyTradeCard from '@/app/sections/smart/components/mCopyCard'
import CopyCardEmpty from '@/app/sections/smart/components/mCopyCardEmpty'
import { useAccount } from '@/app/hooks/useAccount'
import CopyTrade from '@/app/services/copyTrade'
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
export default function CardContainer() {
  const { address: walletAddress } = useAccount();
  const [smartMoniesInfo, setSmartMoniesInfo] = useState<SmartMoneyAddress | null>(null);
  const CopyTradeService = new CopyTrade();
  const [copyTradersUserInfo, setCopyTradersUserInfo] = useState<CopyTraderAddress | null>(null);

  const getCopyTradeDetails = async () => {
    if (walletAddress) {
        const { data } = await CopyTradeService.getCopyTradersUserInfo({address: walletAddress, chain: 'solana'});
        setCopyTradersUserInfo(data);
    }
  }
  const getSmartMoniesInfo = async () => {
    if (walletAddress) {
        const { data } = await CopyTradeService.getSmartMoniesAddress({address: walletAddress, chain: 'solana'});
        setSmartMoniesInfo(data);
        console.log(data);
    }
  }
  useEffect(() => {
    getSmartMoniesInfo();
    getCopyTradeDetails();
  }, [walletAddress]);
  console.log(smartMoniesInfo, 'smartMoniesInfo')
  console.log(copyTradersUserInfo, 'copyTradersUserInfo')

  const isTopTrader = copyTradersUserInfo?.isTopTrader;
  const isCopyier = copyTradersUserInfo && copyTradersUserInfo?.tradeInfo?.buys > 0;

  if (!walletAddress) {
    return null
  }
  
  return (
    <div className={styles.container + ' ' + (isTopTrader ? styles.topTraderContainer : styles.copyTradeContainer)}>
       {
        isTopTrader ? (
          <>
            <TopTraderCard smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo}/>
            {
              isCopyier ? (
                <CopyTradeCard smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo}/>
              ) : (
                <CopyCardEmpty />
              )
            }
          </>
        ) : (
           isCopyier ? (
            <CopyTradeCard smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo}/>
           ) : (
            <CopyCardEmpty />
           )
        )
       }
    </div>
  )
}
