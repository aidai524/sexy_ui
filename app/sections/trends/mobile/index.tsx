'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/components/top';
import Carousel from '@/app/sections/trends/components/carousel';
import Header from '@/app/sections/trends/components/header';
import Item from '@/app/sections/trends/components/item';
import { useTrends } from '@/app/sections/trends/hooks';
import { useEffect } from 'react';
import { uniqBy } from 'lodash';
import InfiniteScrollContent from '@/app/components/infinite-scroll-content';
import { InfiniteScroll } from 'antd-mobile';
import TrendsLoading from '@/app/sections/trends/components/loading';

export default function Mobile(props: any) {
  const { handleBuy } = props;

  const {
    hottestList,
    tableList,
    top1,
    getTop1,
    getHottestList,
    getTableList,
    tableListPageMore,
    tableListPageIndex,
    top1Loading,
    hottestListLoading,
    tableListLoading,
  } = useTrends();

  const isLoading = top1Loading || hottestListLoading || tableListLoading;

  useEffect(() => {
    getTop1();
    getHottestList();
  }, []);

  return (
    <div className={styles.Container}>
      <Header />
      <Carousel />
      <Top onBuy={() => handleBuy(top1)} trend={top1} isMobile />
      <div className={styles.List}>
        {
          isLoading ? (
            <TrendsLoading />
          ) : (
            <>
              {
                uniqBy([...hottestList, ...tableList], 'address')
                  .filter((it) => it.address !== top1?.address)
                  .map((item) => (
                    <Item
                      key={item.id}
                      onBuy={() => handleBuy(item)}
                      trend={item}
                    />
                  ))
              }
              <InfiniteScroll
                loadMore={() => {
                  return getTableList({ pageIndex: tableListPageIndex });
                }}
                hasMore={tableListPageMore}
              >
                <InfiniteScrollContent hasMore={tableListPageMore} />
              </InfiniteScroll>
            </>
          )
        }
      </div>
    </div>
  );
}


