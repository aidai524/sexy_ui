'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/components/top';
import Header from '@/app/sections/trends/components/header';
import Item from '@/app/sections/trends/components/item';
import { useTrends } from '@/app/sections/trends/hooks';
import { useEffect } from 'react';
import TrendsLoading from '@/app/sections/trends/components/loading';
import Tab from '@/app/components/tab';
import TopTraders from '@/app/sections/trends/components/top-traders';

export default function Mobile(props: any) {
  const { handleBuy } = props;

  const {
    hottestList,
    tableList,
    top1,
    getAllList,
    allListLoading,
  } = useTrends();

  const tabNotes = [
    {
      name: "Hot Memes",
      content:  
      <>
      <Top onBuy={() => handleBuy(top1)} trend={top1} isMobile loading={allListLoading} />

      <div className={styles.List}>
      {
        allListLoading ? (
          <TrendsLoading />
        ) : (
          <>
            {
              [...hottestList, ...tableList].map((item) => (
                <Item
                  key={item.id}
                  onBuy={() => handleBuy(item)}
                  trend={item}
                />
              ))
            }
          </>
        )
      }
    </div>
    </>
    },
    {
      name: "Top Traders",
      content: <TopTraders />
    }
  ]

  useEffect(() => {
    getAllList();
  }, []);


  return (
    <div className={styles.Container}>
      <Header />
      <div style={{ marginTop: 40 }}>
      <Tab nodes={tabNotes} activeNode={tabNotes[0].name}/>
      </div>
    </div>
  );
}


