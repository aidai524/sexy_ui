'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/top';
import Carousel from '@/app/sections/trends/carousel';
import Header from '@/app/sections/trends/header';
import Item from '@/app/sections/trends/item';
import { useState } from 'react';
import Trade from '@/app/components/trade';
import { Popup } from 'antd-mobile';
import { useTrends } from '@/app/sections/trends/hooks';

export default function Trends() {
  const [visible, setVisible] = useState(false);

  const { list } = useTrends();

  const handleBuy = () => {
    setVisible(true);
  };

  const handleBuyClose = () => {
    setVisible(false);
  };

  return (
    <div className={styles.Container}>
      <Header />
      <Carousel />
      <Top onBuy={handleBuy} />
      <div className={styles.List}>
        <Item onBuy={handleBuy} />
        <Item onBuy={handleBuy} />
        <Item onBuy={handleBuy} />
        <Item onBuy={handleBuy} />
      </div>
      <Popup
        visible={visible}
        onMaskClick={handleBuyClose}
        onClose={handleBuyClose}
        bodyStyle={{
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <div className={styles.BuyContent}>
          <div
            className={styles.BuyContentLogo}
            style={{ backgroundImage: `url("/192x192.png")` }}
          >
            <div
              className={styles.BuyContentTickerAvatar}
              style={{ backgroundImage: `url("/192x192.png")` }}
            />
          </div>
          <div className={styles.BuyContentInfo}>
            VVAIFU / Ticker: VVA
          </div>
          <Trade
            token={{
              tokenName: 'tokenName',
              tokenSymbol: 'TOKEN',
              tokenUri: 'https://www.google.com',
              tokenDecimals: 18,
            } as any}
            initType="buy"
            from="mobile"
          />
        </div>
      </Popup>
    </div>
  );
}
