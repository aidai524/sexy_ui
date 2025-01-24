import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import CoppiedModal from '@/app/sections/profile/components/coppiedModal';
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import { formatAddress } from '@/app/utils';
import { fecthUserInfo } from '@/app/utils/getUserInfo';
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

export default function TopTradersPC({list}: {list: any[]}) {
  const [sortField, setSortField] = useState<'roi' | '7d' | '30d' | '1d'>('roi');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentTrader, setCurrentTrader] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // fetchTraders(sortField, sortDirection);
  }, [sortField, sortDirection]);

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
        {/* <div className={styles.headerItem} onClick={() => handleSort('1d')}>
          1D PnL <TriangleIcon direction={sortField === '1d' ? sortDirection : undefined} highlight={sortField === '1d'} />
        </div> */}
        <div className={styles.headerItem} onClick={() => handleSort('7d')}>
          7D PnL <TriangleIcon direction={sortField === '7d' ? sortDirection : undefined} highlight={sortField === '7d'} />
        </div>
        {/* <div className={styles.headerItem} onClick={() => handleSort('30d')}>
          30D PnL <TriangleIcon direction={sortField === '30d' ? sortDirection : undefined} highlight={sortField === '30d'} />
        </div> */}
        <div className={styles.headerItem}></div>
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
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div> 

  )
}


const TraderItem = ({ trader, onCopyTradeClick }: { trader: any, onCopyTradeClick: (trader: any) => void }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fecthUserInfo(trader.address);
      setUser(userInfo);
    };
    fetchUser();
  }, [trader.address]);

  return (
    <div className={styles.traderItem}>
      <div className={styles.traderInfo}>
        <div className={styles.avatar}>
          <Image src={user?.icon || defaultAvatar} alt={trader.name} width={36} height={36} />
        </div>
        <div className={styles.nameWrapper}>
          <div className={styles.name}>{formatAddress(trader.address)}</div>
          <div className={styles.followers}>{user?.followers || 0} followers</div>
        </div>
      </div>
      
      <div className={styles.pnl}>
        {trader.pnl7D}%
      </div>

      <button className={styles.copyButton} onClick={() => onCopyTradeClick(trader)}>Copy</button>
    </div>
  );
};


export function TriangleIcon({ direction, highlight }: { direction?: 'asc' | 'desc', highlight?: boolean }) {
  const fillColor = highlight ? '#9290B1' : 'rgba(146, 144, 177, 0.3)';

  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.16533 9.73501C6.56057 10.334 7.43943 10.334 7.83467 9.73501L12.905 2.05074C13.3437 1.38589 12.8668 0.5 12.0703 0.5H1.9297C1.13315 0.5 0.65633 1.38589 1.09502 2.05074L6.16533 9.73501Z" fill={fillColor}/>
    </svg>
  );
}