import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config"
import Empty from '@/app/components/empty'
import CoppiedModal from '@/app/sections/profile/components/coppiedModal'
import { SHOW_COPY_TRADE } from '@/app/utils/config'
import useUserInfo from '@/app/hooks/useUserInfo'
import { formatAddress } from '@/app/utils'
import { numberFormatter } from '@/app/utils/common'

interface Trader {
  avatar: string
  name: string
  followers: number
  roi: number
  pnl: {
    'pnl1D': number
    'pnl7D': number
    'pnl30D': number
  }
  profit: {
    '1d': string
    '7d': string
    '30d': string
  }
}

const TraderItem = ({ trader, onCopyTradeClick, activeTab }: { trader: any, onCopyTradeClick: (trader: any) => void, activeTab: string }) => {
  const { fecthUserInfo } = useUserInfo(undefined);
  const [user, setUser] = useState<any>(null);

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
      default:
        return trader.pnl7D;
    }
  };

  return (
    <div className={styles.traderCard} onClick={() => onCopyTradeClick(trader)}>
      <div className={styles.traderInfo}>
        <Image 
          src={user?.icon || defaultAvatar} 
          alt={trader.name} 
          width={40} 
          height={40} 
          className={styles.avatar}
        />
        <div className={styles.nameContainer}>
          <div className={styles.name}>{formatAddress(trader.address) || formatAddress(user?.address)}</div>
          <div className={styles.followers}>{user?.followers || 0} followers</div>
        </div>
      </div>
      <div className={styles.metrics}>
        <div className={styles.percentage}>{numberFormatter(getPnlValue(), 4, true)}%</div>
      </div>
    </div>
  );
};

export default function TopTradersMobile({list, setOrderBy, orderBy}: {list: any[], setOrderBy: any, orderBy: string}) {
  const [activeTab, setActiveTab] = useState<'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D'>(orderBy as any || 'pnl7D')
  const [currentTrader, setCurrentTrader] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const tabs = [
    { id: 'pnl1D', label: '1D PnL' },
    { id: 'pnl7D', label: '7D PnL' },
    { id: 'pnl30D', label: '30D PnL' },
  ]

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true)
    setCurrentTrader(trader)
  }

  useEffect(() => {
    setActiveTab(orderBy as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D');
  }, [orderBy]);

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => {
              setActiveTab(tab.id as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D')
              setOrderBy(tab.id as 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D')
            }}
          >
            {tab.label}
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