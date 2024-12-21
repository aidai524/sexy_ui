'use client';

import styles from "./index.module.css";
import Top from '@/app/sections/trends/top';
import Carousel from '@/app/sections/trends/carousel';
import Header from '@/app/sections/trends/header';
import Item from '@/app/sections/trends/item';
import { useState } from 'react';
import Trade from '@/app/components/trade';
import { Popup } from 'antd-mobile';
import { Trend, useTrends } from '@/app/sections/trends/hooks';

export default function Trends() {
  const [visible, setVisible] = useState(false);
  const [tradeToken, setTradeToken] = useState<any>({});

  const { list, top1 } = useTrends();

  const handleBuy = (trend?: Trend) => {
    if (!trend) return;
    setTradeToken({
      tokenName: trend.token_name,
      tokenSymbol: trend.token_symbol,
      tokenUri: trend.Icon,
      ticker: trend.ticker,
      tokenDecimals: 18,
      tickerAvatar: '',
    });
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
        {
          visible && (
            <div className={styles.BuyContent}>
              <div
                className={styles.BuyContentLogo}
                style={{ backgroundImage: `url("${tradeToken?.tokenUri}")` }}
              >
                {
                  tradeToken?.tickerAvatar && (
                    <div
                      className={styles.BuyContentTickerAvatar}
                      style={{ backgroundImage: `url("${tradeToken?.tickerAvatar}")` }}
                    />
                  )
                }
              </div>
              <div className={styles.BuyContentInfo}>
                {tradeToken?.tokenSymbol} / Ticker: {tradeToken?.ticker}
              </div>
              <Trade
                token={tradeToken}
                initType="buy"
                from="mobile"
              />
            </div>
          )
        }
      </Popup>
    </div>
  );
}
