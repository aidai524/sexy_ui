import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import TopTraderCard from '@/app/sections/smart/components/mTraderCard'
import CopyTradeCard from '@/app/sections/smart/components/mCopyCard'
import CopyCardEmpty from '@/app/sections/smart/components/mCopyCardEmpty'
import { useAccount } from '@/app/hooks/useAccount'
import CopyTrade from '@/app/services/copyTrade'
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { useUserAgent } from "@/app/context/user-agent";
import CircleLoading from "@/app/components/icons/loading";
import { useCopyTradeRefresh } from '@/app/store/useCopyTradeRefresh'
import MCopyCardSkeleton from './ske';
export default function CardContainer() {
  const { address: walletAddress } = useAccount();
  const { lastCopyTradeTime, set: setLastCopyTradeTime }:any = useCopyTradeRefresh();
  const { isMobile } = useUserAgent();
  const [smartMoniesInfo, setSmartMoniesInfo] = useState<SmartMoneyAddress | null>(null);
  const CopyTradeService = new CopyTrade();
  const [copyTradersUserInfo, setCopyTradersUserInfo] = useState<CopyTraderAddress | null>(null);
  const [isLoading, setIsLoading] = useState(walletAddress ? true : false);
  const [refreshing, setRefreshing] = useState(0);

  const getCopyTradeDetails = async () => {
    if (walletAddress) {
      try {
        const { data } = await CopyTradeService.getCopyTradersUserInfo({address: walletAddress, chain: 'solana'});
        setCopyTradersUserInfo(data);
      } finally {
        setIsLoading(false);
      }
    }
  }
  const getSmartMoniesInfo = async () => {
    if (walletAddress) {
        const { data } = await CopyTradeService.getSmartMoniesAddress({address: walletAddress, chain: 'solana'});
        setSmartMoniesInfo(data);
    }
  }
  useEffect(() => {
    if (walletAddress){
      setIsLoading(true);
    }
    getSmartMoniesInfo();
    getCopyTradeDetails();
  }, [walletAddress,refreshing,lastCopyTradeTime]);


  // const isTopTrader = copyTradersUserInfo?.isTopTrader;
  const isTopTrader = true;
  const isCopyier = copyTradersUserInfo && +copyTradersUserInfo?.tradeInfo?.totalInvestment > 0;

  // if (!walletAddress) {
  //   return null
  // }


  if (isLoading) {
    return <MCopyCardSkeleton />;
  }

  
  return (
    <div className={(isMobile ? styles.container : styles.containerPC) + ' ' + (isTopTrader ? styles.topTraderContainer : styles.copyTradeContainer)}>
       {
        isTopTrader ? (
          <>
            <TopTraderCard setRefreshing={setRefreshing} refreshing={refreshing} smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo}/>
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
            <CopyTradeCard useLinear={true} smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo}/>
           ) : (
            <CopyCardEmpty />
           )
        )
       }
    </div>
  )
}
