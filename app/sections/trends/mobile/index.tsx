'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/components/top';
import Carousel from '@/app/sections/trends/components/carousel';
import Header from '@/app/sections/trends/components/header';
import Item from '@/app/sections/trends/components/item';
import { useState } from 'react';
import { Trend, useTrends } from '@/app/sections/trends/hooks';
import BuyModal from '@/app/sections/trends/components/buy';
import { useTrade } from '@/app/sections/trends/hooks/trade';

export default function Mobile() {
  const { tradeToken, onTrade, setTradeToken } = useTrade();

  const [visible, setVisible] = useState(false);

  const { list, top1 } = useTrends();

  const handleBuy = (trend?: Trend) => {
    if (!trend) return;
    onTrade(trend);
    setVisible(true);
  };

  const handleBuyClose = () => {
    setVisible(false);
    setTradeToken({});
  };

  return (
    <div className={styles.Container}>
      <Header />
      <Carousel />
      <Top onBuy={() => handleBuy(top1)} trend={top1} />
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
      <BuyModal
        visible={visible}
        tradeToken={tradeToken}
        onClose={handleBuyClose}
      />
    </div>
  );
}
