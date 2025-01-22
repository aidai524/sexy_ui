import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import Empty from '@/app/components/empty';
import CoppiedModal from '@/app/sections/profile/components/coppiedModal';
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import {fetchMockTraders} from '../trade';

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

export default function TopTradersPC() {
  const [sortField, setSortField] = useState<'roi' | '7d' | '30d' | '1d'>('roi');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [traders, setTraders] = useState<Trader[]>([]);
  const [currentTrader, setCurrentTrader] = useState<Trader | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchTraders = async (field: string, direction: string) => {
    setLoading(true);
    try {
      const data = await fetchMockTraders(field, 'desc')
    //   if (!response.ok) throw new Error('Failed to fetch traders');
    //   const data = await response.json();
      setTraders(data as Trader[]);
    } catch (error) {
      console.error('Error fetching traders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraders(sortField, sortDirection);
  }, [sortField, sortDirection]);

  // 模拟数据
  useEffect(() => {
    const mockData: Trader[] = [
      {
        avatar: '',
        name: 'Trader One',
        followers: 1500,
        roi: 12.5,
        pnl: { '1d': 1.2, '7d': 5.6, '30d': 10.1 },
        profit: { '1d': '120', '7d': '560', '30d': '1010' }
      },
      {
        avatar: '',
        name: 'Trader Two',
        followers: 2300,
        roi: 15.3,
        pnl: { '1d': 2.3, '7d': 6.7, '30d': 12.4 },
        profit: { '1d': '230', '7d': '670', '30d': '1240' }
      }
    ];

    setTraders(mockData);
  }, []);

  const handleSort = (field: 'roi' | '7d' | '30d' | '1d') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true);
    setCurrentTrader(trader);
  }


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerItem}>Trader</div>
        <div className={styles.headerItem} onClick={() => handleSort('roi')}>
          ROI <TriangleIcon direction={sortField === 'roi' ? sortDirection : undefined} highlight={sortField === 'roi'} />
        </div>
        <div className={styles.headerItem} onClick={() => handleSort('1d')}>
          1D PnL <TriangleIcon direction={sortField === '1d' ? sortDirection : undefined} highlight={sortField === '1d'} />
        </div>
        <div className={styles.headerItem} onClick={() => handleSort('7d')}>
          7D PnL <TriangleIcon direction={sortField === '7d' ? sortDirection : undefined} highlight={sortField === '7d'} />
        </div>
        <div className={styles.headerItem} onClick={() => handleSort('30d')}>
          30D PnL <TriangleIcon direction={sortField === '30d' ? sortDirection : undefined} highlight={sortField === '30d'} />
        </div>
        <div className={styles.headerItem}></div>
      </div>

      <div className={styles.traderList}>
        {loading ? (
          <div style={{ paddingTop: 116 }}>
            <Empty text="Loading..." />
          </div>
        ) : traders.length === 0 ? (
          <div style={{ paddingTop: 116 }}>
            <Empty text="No traders yet" />
          </div>
        ) : (
          traders.map((trader, index) => (
            <div key={index} className={styles.traderItem}>
              <div className={styles.traderInfo}>
                <div className={styles.avatar}>
                  <Image src={trader.avatar || defaultAvatar} alt={trader.name} width={36} height={36} />
                </div>
                <div className={styles.nameWrapper}>
                  <div className={styles.name}>{trader.name}</div>
                  <div className={styles.followers}>{trader.followers} followers</div>
                </div>
              </div>
              
              <div className={styles.roi}>
                {trader.roi}%
                <span className={styles.profit}>+${trader.profit['1d']}</span>
              </div>
              
              <div className={styles.pnl}>
                {trader.pnl['1d']}%
                <span className={styles.profit}>+${trader.profit['1d']}</span>
              </div>
              
              <div className={styles.pnl}>
                {trader.pnl['7d']}%
                <span className={styles.profit}>+${trader.profit['7d']}</span>
              </div>
              
              <div className={styles.pnl}>
                {trader.pnl['30d']}%
                <span className={styles.profit}>+${trader.profit['30d']}</span>
              </div>

              <button className={styles.copyButton} onClick={() => handleCopyTradeClick(trader)}>Copy</button>
            </div>
          ))
        )}
      </div>
      {SHOW_COPY_TRADE && (
        <CoppiedModal
          copiedInfo={currentTrader}
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div> 

  )
}

export function TriangleIcon({ direction, highlight }: { direction?: 'asc' | 'desc', highlight?: boolean }) {
  const fillColor = highlight ? '#9290B1' : 'rgba(146, 144, 177, 0.3)';

  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.16533 9.73501C6.56057 10.334 7.43943 10.334 7.83467 9.73501L12.905 2.05074C13.3437 1.38589 12.8668 0.5 12.0703 0.5H1.9297C1.13315 0.5 0.65633 1.38589 1.09502 2.05074L6.16533 9.73501Z" fill={fillColor}/>
    </svg>
  );
}