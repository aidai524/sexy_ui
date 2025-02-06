import React, { useState, useCallback, useEffect } from 'react'
import TopTradersMobile from './m-traders'
import TopTradersPC from './pc-traders'
import { useUserAgent } from '@/app/context/user-agent'
import styles from './index.module.css'
import { useGetSmartMonies } from '../../hooks/useGetSmartMonies';
import Empty from '@/app/components/empty';
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";

export default function TopTraders() {
  const { isMobile } = useUserAgent()
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [tradersList, setTradersList] = useState<{items: any[], total: number}>({
    items: [],
    total: 0
  });
  
  const { smartMonies, smartMoniesLoading } = useGetSmartMonies({ 
    chain: 'solana', 
    page: pageIndex, 
    pageSize 
  });

  useEffect(() => {
    if (smartMonies?.items) {
      setTradersList({
        items: pageIndex === 1 ? smartMonies.items : [...tradersList.items, ...smartMonies.items],
        total: smartMonies.total
      });

      setHasMore(smartMonies.items.length >= pageSize);
    }
  }, [smartMonies, pageIndex, pageSize]);

  const loadMore = useCallback(() => {
    setPageIndex(prev => prev + 1);
  }, []);

  if (smartMoniesLoading && pageIndex === 1) {
    return <div style={{ paddingTop: 116 }}>
      <Empty text="Loading..." />
    </div>
  }

  if (tradersList.items.length === 0 && !smartMoniesLoading) {
    return <div style={{ paddingTop: 116 }}>
      <Empty text="No data" />
    </div>
  }

  return (
    <>
      <div className={styles.topTraders}>
        {isMobile ? 
          <TopTradersMobile list={tradersList.items}/> : 
          <TopTradersPC list={tradersList.items}/>
        }
      </div>
      <SexInfiniteScroll 
        loadMore={loadMore} 
        hasMore={hasMore}
      />
    </>
  )
}
