import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import { defaultAvatar } from "@/app/utils/config";
import CoppiedModal from '@/app/sections/profile/components/coppiedModal';
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import { formatAddress } from '@/app/utils';
import { fecthUserInfo } from '@/app/utils/getUserInfo';
import { numberFormatter } from '@/app/utils/common';
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import { useRouter } from 'next/navigation';
import Big from 'big.js';
import { CrownIcon } from '../icons';
import Empty from '@/app/components/empty';
import { CopyierIconWithBg } from '../icons';
import SkeletonLoader from '../listSkeletonPc';
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
  profit: {
    '1d': string
    '7d': string
    '30d': string
  }
}

export default function TopTradersPC({list,setOrderBy,orderBy,loadMore,hasMore,isLoadingMore,smartMoniesLoading}: {list: any[], setOrderBy: any,orderBy: string,loadMore: any,hasMore: any,isLoadingMore: any,smartMoniesLoading: boolean}) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentTrader, setCurrentTrader] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter()
  const handleSort = (field: 'roi' | 'pnl1D' | 'pnl7D' | 'pnl30D' | 'winRate1D' | 'winRate7D' | 'winRate30D') => {
    if (smartMoniesLoading) return;
    setOrderBy(field)
  };

  const handleCopyTradeClick = (trader: Trader) => {
    setShowModal(true);
    setCurrentTrader(trader);
  }


  return (
    <div className={styles.container}>
      <div className={styles.crownContainer}>
        <CrownIcon />{" "}
        <span className={styles.crownTextContainer}>
          TOP <span className={styles.crownText}>Trader</span>
        </span>
      </div>
      <div className={styles.header}>
        <div className={styles.headerItem}>Trader / Coppy Traders</div>
        {/*  */}
       <div className={styles.filterItem}>
        
            <div className={styles.headerItem + ' ' + (orderBy === 'pnl1D' ? styles.filterItemContent : '')} onClick={() => handleSort('pnl1D')}>
            <div>1D</div> PnL <SolIconWithoutBg highlight={orderBy === 'pnl1D'} /> 
            </div>
            <span>/</span>
           <div className={styles.headerItem + ' ' + (orderBy === 'winRate1D' ? styles.filterItemContent : '')} onClick={() => handleSort('winRate1D')}>
              Win Rate <TriangleIcon direction={orderBy === 'winRate1D' ? sortDirection : undefined} highlight={orderBy === 'winRate1D' || orderBy === 'pnl1D'} />
            </div>
       </div>
       {/*  */}
       <div className={styles.filterItem}>
            <div className={styles.headerItem + ' ' + (orderBy === 'pnl7D' ? styles.filterItemContent : '')} onClick={() => handleSort('pnl7D')}>
            <div>7D</div> PnL <SolIconWithoutBg highlight={orderBy === 'pnl7D'} /> 
            </div>
            <span>/</span>
           <div className={styles.headerItem + ' ' + (orderBy === 'winRate7D' ? styles.filterItemContent : '')} onClick={() => handleSort('winRate7D')}>
              Win Rate <TriangleIcon direction={orderBy === 'winRate7D' ? sortDirection : undefined} highlight={orderBy === 'winRate7D' || orderBy === 'pnl7D'} />
            </div>
       </div>
       {/*  */}
       <div className={styles.filterItem}>
        
          <div className={styles.headerItem + ' ' + (orderBy === 'pnl30D' ? styles.filterItemContent : '')} onClick={() => handleSort('pnl30D')}>
          <div>30D</div>  PnL <SolIconWithoutBg highlight={orderBy === 'pnl30D'} /> 
            </div>
            <span>/</span>
           <div className={styles.headerItem + ' ' + (orderBy === 'winRate30D' ? styles.filterItemContent : '')} onClick={() => handleSort('winRate30D')}>
              Win Rate <TriangleIcon direction={orderBy === 'winRate30D' ? sortDirection : undefined} highlight={orderBy === 'winRate30D' || orderBy === 'pnl30D'} />
            </div>
       </div>
      </div>

      <div className={styles.traderList}>
        {list.length > 0 ? (
          <>
            {list.map((trader, index) => (
              <TraderItem 
                key={index}
                trader={trader}
                onCopyTradeClick={handleCopyTradeClick}
              />
            ))}
            <SexInfiniteScroll 
              loadMore={loadMore} 
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
            />
          </>
        ) : (
          smartMoniesLoading ? 
          <SkeletonLoader /> : 
           <div style={{ paddingTop: 116 }}>
              <Empty text="No data" />
          </div>
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


const TraderItem = ({ trader, onCopyTradeClick }: { trader: any, onCopyTradeClick: (trader: any) => void }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fecthUserInfo(trader.address);
      setUser(userInfo);
    };
    fetchUser();
  }, [trader.address]);

  return (
    <div className={styles.traderItem} onClick={() => {
      router.push("/smartTopDetail?address=" + trader.address);
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
        <div className={styles.nameWrapper}>
          <div className={styles.name}>{formatAddress(trader.address) || formatAddress(user?.address)}</div>
          <div className={styles.followers}>
            <CopyierIconWithBg /> {trader?.copiers?.length || 0}
          </div>
        </div>
      </div>
      <div className={styles.pnl}>
        {
        trader.pnl1D >= 0 ? 
        '+' + numberFormatter(trader.pnl1D, 2, true, { isShort: true, isShortUppercase: true }) : 
        '-' + numberFormatter(Math.abs(trader.pnl1D), 2, true, { isShort: true, isShortUppercase: true })
        } SOL

        <div className={styles.winRate}>
        {
        new Big(trader.winRate1D).times(100).toFixed(1)
        }%
      </div>
      </div>
      <div className={styles.pnl}>
        {
        trader.pnl7D >= 0 ? 
        '+' + numberFormatter(trader.pnl7D, 2, true, { isShort: true, isShortUppercase: true }) : 
        '-' + numberFormatter(Math.abs(trader.pnl7D), 2, true, { isShort: true, isShortUppercase: true })
        } SOL

        <div className={styles.winRate}>
        {
        new Big(trader.winRate7D).times(100).toFixed(1)
        }%
      </div>
      </div>
      <div className={styles.pnl}>
        {
        trader.pnl30D >= 0 ? 
        '+' + numberFormatter(trader.pnl30D, 2, true, { isShort: true, isShortUppercase: true }) : 
        '-' + numberFormatter(Math.abs(trader.pnl30D), 2, true, { isShort: true, isShortUppercase: true })
        } SOL

        <div className={styles.winRate}>
        {
        new Big(trader.winRate30D).times(100).toFixed(1)
        }%
      </div>
      </div>
      <div className={styles.copingContainer}>

            <button 
                className={styles.copyButton} 
                onClick={(e) => {
                    e.stopPropagation(); 
                    onCopyTradeClick(trader);
                  }}
              >Copy
            </button>
        </div>

     
    </div>
  );
};


export function TriangleIcon({ direction, highlight }: { direction?: 'asc' | 'desc', highlight?: boolean }) {
  const fillColor = highlight ? '#FBCA04' : 'rgba(146, 144, 177, 0.3)';

  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.16533 9.73501C6.56057 10.334 7.43943 10.334 7.83467 9.73501L12.905 2.05074C13.3437 1.38589 12.8668 0.5 12.0703 0.5H1.9297C1.13315 0.5 0.65633 1.38589 1.09502 2.05074L6.16533 9.73501Z" fill={fillColor}/>
    </svg>
  );
}


const SolIconWithoutBg = ({ highlight }: { highlight?: boolean }) => {
  const fillColor = highlight ? '#FBCA04' : '#9290B1';
  return (
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.875 0H11.25L9.375 2.5H0L1.875 0ZM1.875 7.5H11.25L9.375 10H0L1.875 7.5ZM11.25 6.25H1.875L0 3.75H9.375L11.25 6.25Z" fill={fillColor}/>
   </svg> )   
}