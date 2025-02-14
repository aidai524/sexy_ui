import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config"
import Empty from '@/app/components/empty'
import CoppiedModal from '@/app/sections/profile/components/coppiedModal'
import { SHOW_COPY_TRADE } from '@/app/utils/config'
import useUserInfo from '@/app/hooks/useUserInfo'
import { formatAddress } from '@/app/utils'
import { numberFormatter } from '@/app/utils/common'
import SexInfiniteScroll from '@/app/components/sexInfiniteScroll'
import { useRouter } from 'next/navigation'
import Big from 'big.js'
interface Trader {
  avatar: string
  name: string
  followers: number
  roi: number
  pnl: {
    'pnl1D': number
    'pnl7D': number
    'pnl30D': number
    'winRate1D': string
    'winRate7D': string
    'winRate30D': string
  }
}

const TraderItem = ({ trader, onCopyTradeClick, activeTab }: { trader: any, onCopyTradeClick: (trader: any) => void, activeTab: string }) => {
  const { fecthUserInfo } = useUserInfo(undefined);
  const [user, setUser] = useState<any>(null);
  const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fecthUserInfo(trader.address);
      setUser(userInfo);
    };
    fetchUser();
  }, [trader.address]);

  const getPnlValue = () => {
    switch (activeTab) {
      case 'pnl1D':
        return trader.pnl1D;
      case 'pnl7D':
        return trader.pnl7D;
      case 'pnl30D':
        return trader.pnl30D;
      case 'winRate1D':
        return trader.winRate1D;
      case 'winRate7D':
        return trader.winRate7D;
      case 'winRate30D':
        return trader.winRate30D;
      default:
        return trader.pnl7D;
    }
  };

  return (
    <div className={styles.traderCardContainer}>
    <div className={styles.traderCard} onClick={() => {
      router.push("/profile/user?account=" + trader.address + "&from=detail");
    }}>
      <div className={styles.traderInfo}>
      <div className={styles.avatar}>
          <Image src={user?.icon || defaultAvatar} alt={trader.name} width={40} height={40} />
          {
              trader?.copied ?
              <div className={styles.coping}>
                <div className={styles.copingIcon}></div>
                <span className={styles.copingText}>Copying</span>
              </div>
              :
             null
            }
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            <div className={styles.nameText}>
              {formatAddress(trader?.address) || formatAddress(user?.address)} 
            </div>
          </div>
          <div className={styles.followers}>{user?.followers || 0} followers</div>
        </div>
      </div>
      <div className={styles.metricsContainer}>
        <div className={styles.metrics}>
          <div className={styles.percentage}>{
            activeTab === 'winRate1D' || activeTab === 'winRate7D' || activeTab === 'winRate30D' ?
            new Big(getPnlValue()).times(100).toFixed(1) + '%' :
            getPnlValue() >= 0 ? 
            numberFormatter(getPnlValue(), 2, true, { isShort: true, isShortUppercase: true }) + ' SOL' : 
            '-' + numberFormatter(Math.abs(getPnlValue()), 2, true, { isShort: true, isShortUppercase: true }) + ' SOL'
          } </div>
        </div>

      </div>
    </div>
    <div className={styles.copyIcon} onClick={(e) => {
              e.stopPropagation(); 
              onCopyTradeClick(trader);
            }}>
      <CopyIcon />
    </div>
    </div>
  );
};

export default function TopTradersMobile({list, setOrderBy, orderBy, loadMore, hasMore, isLoadingMore, smartMoniesLoading}: {list: any[], setOrderBy: any, orderBy: string, loadMore: any, hasMore: any, isLoadingMore: any, smartMoniesLoading: boolean}) {
  const [activeTab, setActiveTab] = useState<'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D' | 'winRate1D' | 'winRate7D' | 'winRate30D'>(orderBy as any || 'pnl7D')
  const [currentTrader, setCurrentTrader] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'pnl1D', label: '1D PnL' },
    { id: 'pnl7D', label: '7D PnL' },
    { id: 'pnl30D', label: '30D PnL' },
    { id: 'winRate1D', label: '1D Win Rate' },
    { id: 'winRate7D', label: '7D Win Rate' },
    { id: 'winRate30D', label: '30D Win Rate' },
  ]

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true)
    setCurrentTrader(trader)
  }

  useEffect(() => {
    if (orderBy && !smartMoniesLoading) {
      setActiveTab(orderBy as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D' | 'winRate1D' | 'winRate7D' | 'winRate30D');
      const button = tabContainerRef.current?.querySelector(`button[data-tab-id="${orderBy}"]`);
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [orderBy]);

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D' | 'winRate1D' | 'winRate7D' | 'winRate30D');
    setOrderBy(tab.id as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D' | 'winRate1D' | 'winRate7D' | 'winRate30D');
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer} ref={tabContainerRef}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label} {
              ['pnl1D', 'pnl7D', 'pnl30D'].includes(tab.id) && <SolIconWithoutBg highlight={activeTab === tab.id} />
            }
          </button>
        ))}
      </div>

      <div className={styles.traderList}>
        {list.map((trader, index) => (
          <TraderItem 
            key={index}
            trader={trader}
            onCopyTradeClick={handleCopyTradeClick}
            activeTab={activeTab}
          />
        ))}
         <SexInfiniteScroll 
          loadMore={loadMore} 
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
      </div>

      {SHOW_COPY_TRADE && (
        <CoppiedModal
          copiedInfo={currentTrader}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}


const CopyIcon = ()=>{
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="4.5" width="9.625" height="9.625" rx="2" stroke="#9290B1"/>
<path d="M5.375 3.1875V3C5.375 1.89543 6.27043 1 7.375 1H13C14.1046 1 15 1.89543 15 3V8.625C15 9.72957 14.1046 10.625 13 10.625H12.375" stroke="#9290B1"/>
</svg>

  )
}


const SolIconWithoutBg = ({ highlight }: { highlight?: boolean }) => {
  const fillColor = highlight ? '#FBCA04' : '#9290B1';
  return (
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.875 0H11.25L9.375 2.5H0L1.875 0ZM1.875 7.5H11.25L9.375 10H0L1.875 7.5ZM11.25 6.25H1.875L0 3.75H9.375L11.25 6.25Z" fill={fillColor}/>
   </svg> )   
}