import React, { useState, useCallback, useEffect } from 'react'
import TopTradersMobile from './m-traders'
import TopTradersPC from './pc-traders'
import { useUserAgent } from '@/app/context/user-agent'
import styles from './index.module.css'
import { useGetSmartMonies } from '../../hooks/useGetSmartMonies';
import Empty from '@/app/components/empty';

export default function TopTraders() {
  const { isMobile } = useUserAgent()
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [tradersList, setTradersList] = useState<{items: any[], total: number}>({
    items: [],
    total: 0
  });
  const [orderBy, setOrderBy] = useState<string>('pnl7D')
  
  const { smartMonies, smartMoniesLoading } = useGetSmartMonies({ 
    chain: 'solana', 
    page: pageIndex, 
    pageSize,
    orderBy 
  });

  useEffect(() => {
    if (smartMonies?.items) {
      setTradersList({
        items: pageIndex === 1 ? smartMonies.items : [...tradersList.items, ...smartMonies.items],
        total: smartMonies.total
      });

      setHasMore(smartMonies.items.length >= pageSize);
      setIsLoadingMore(false);
    }
  }, [smartMonies]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && !smartMoniesLoading) {
      setIsLoadingMore(true);
      setPageIndex(prev => prev + 1);
    }
  }, [isLoadingMore, smartMoniesLoading]);

  const handleOrderByChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy);
    setPageIndex(1);
    setTradersList({
      items: [],
      total: 0
    });
    setHasMore(true);
  };

  // if (smartMoniesLoading && tradersList.items.length === 0) {
  //   return <div style={{ paddingTop: 116 }}>
  //     <Empty text="Loading" showLoading={true} />
  //   </div>
  // }

  if (tradersList.items.length === 0 && !smartMoniesLoading) {
    return <div style={{ paddingTop: 116 }}>
      <Empty text="No data" />
    </div>
  }

  return (
    <>
      <div className={styles.topTraders}>
        {isMobile ? 
          <TopTradersMobile list={tradersList.items} setOrderBy={handleOrderByChange} orderBy={orderBy} loadMore={loadMore} hasMore={hasMore || smartMoniesLoading} isLoadingMore={isLoadingMore} /> : 
          <TopTradersPC list={tradersList.items} setOrderBy={handleOrderByChange} orderBy={orderBy} loadMore={loadMore} hasMore={hasMore || smartMoniesLoading} isLoadingMore={isLoadingMore} />
        }
      </div>
    
    </>
  )
}
