import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config"
import Empty from '@/app/components/empty'
import CoppiedModal from '@/app/sections/profile/components/coppiedModal'
import { SHOW_COPY_TRADE } from '@/app/utils/config'
import useUserInfo from '@/app/hooks/useUserInfo'
import { formatAddress } from '@/app/utils'

interface Trader {
  avatar: string
  name: string
  followers: number
  roi: number
  pnl: {
    '1d': number
    '7d': number
    '30d': number
  }
  profit: {
    '1d': string
    '7d': string
    '30d': string
  }
}

const TraderItem = ({ trader, onCopyTradeClick }: { trader: any, onCopyTradeClick: (trader: any) => void }) => {
  const { fecthUserInfo } = useUserInfo(undefined);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fecthUserInfo(trader.address);
      setUser(userInfo);
    };
    fetchUser();
  }, [trader.address]);

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
        <div className={styles.percentage}>{trader.pnl7D}%</div>
      </div>
    </div>
  );
};

export default function TopTradersMobile({list}: {list: any[]}) {
  const [activeTab, setActiveTab] = useState<'roi' | '1d' | '7d' | '30d'>('7d')
  const [currentTrader, setCurrentTrader] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const tabs = [
    { id: '7d', label: '7D PnL' },
  ]

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true)
    setCurrentTrader(trader)
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id as 'roi' | '1d' | '7d' | '30d')}
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