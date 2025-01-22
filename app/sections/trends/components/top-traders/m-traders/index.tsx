import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config"
import Empty from '@/app/components/empty'
import CoppiedModal from '@/app/sections/profile/components/coppiedModal'
import { SHOW_COPY_TRADE } from '@/app/utils/config'
import { fetchMockTraders } from '../trade'

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

export default function TopTradersMobile() {
  const [activeTab, setActiveTab] = useState<'roi' | '1d' | '7d' | '30d'>('1d')
  const [traders, setTraders] = useState<Trader[]>([])
  const [currentTrader, setCurrentTrader] = useState<Trader | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const tabs = [
    { id: 'roi', label: 'ROI' },
    { id: '1d', label: '1D PnL' },
    { id: '7d', label: '7D PnL' },
    { id: '30d', label: '30D PnL' },
  ]

//   const fetchTraders = async (field: string) => {
//     setLoading(true)
//     try {
//       const response = await fetch(`/api/traders?sort=${field}&order=desc`)
//       if (!response.ok) throw new Error('Failed to fetch traders')
//       const data = await response.json()
//       setTraders(data)
//     } catch (error) {
//       console.error('Error fetching traders:', error)
//     } finally {
//       setLoading(false)
//     }
//   }


  const fetchTraders = async (field: string) => {
    setLoading(true);
    try {
      const data = await fetchMockTraders(field, 'desc')
      setTraders(data as Trader[]);
    } catch (error) {
      console.error('Error fetching traders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraders(activeTab)
  }, [activeTab])

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true)
    setCurrentTrader(trader)
  }

  const getValue = (trader: Trader) => {
    if (activeTab === 'roi') return `${trader.roi}%`
    return `${trader.pnl[activeTab as '1d' | '7d' | '30d']}%`
  }

  const getProfit = (trader: Trader) => {
    return `+$${trader.profit[activeTab as '1d' | '7d' | '30d']}`
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
        {loading ? (
          <div className={styles.emptyContainer}>
            <Empty text="Loading..." />
          </div>
        ) : traders.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Empty text="No traders yet" />
          </div>
        ) : (
          traders.map((trader, index) => (
            <div key={index} className={styles.traderCard} onClick={() => handleCopyTradeClick(trader)}>
              <div className={styles.traderInfo}>
                <Image 
                  src={trader.avatar || defaultAvatar} 
                  alt={trader.name} 
                  width={40} 
                  height={40} 
                  className={styles.avatar}
                />
                <div className={styles.nameContainer}>
                  <div className={styles.name}>{trader.name}</div>
                  <div className={styles.followers}>{trader.followers} followers</div>
                </div>
              </div>
              <div className={styles.metrics}>
                <div className={styles.percentage}>{getValue(trader)}</div>
                <div className={styles.profit}>{getProfit(trader)}</div>
              </div>
            </div>
          ))
        )}
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