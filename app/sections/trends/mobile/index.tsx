'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/components/top';
import Carousel from '@/app/sections/trends/components/carousel';
import Header from '@/app/sections/trends/components/header';
import Item from '@/app/sections/trends/components/item';
import { useTrends } from '@/app/sections/trends/hooks';

export default function Mobile(props: any) {
  const { handleBuy } = props;

  const { list, top1 } = useTrends();

  return (
    <div className={styles.Container}>
      <Header />
      <Carousel />
      <Top onBuy={() => handleBuy(top1)} trend={top1} isMobile />
      <div className={styles.List}>
        {
          list.map((item) => (
            <Item
              key={item.id}
              onBuy={() => handleBuy(item)}
              trend={item}
            />
          ))
        }
      </div>
    </div>
  );
}
