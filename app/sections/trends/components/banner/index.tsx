import { motion } from 'framer-motion';
import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { useTrends } from '@/app/sections/trends/hooks';
import { numberFormatter } from '@/app/utils/common';
import BuyModal from '@/app/sections/trends/components/buy';
import { useTrade } from '@/app/sections/trends/hooks/trade';

const TrendBanner = () => {
  const { top1 } = useTrends({ isPolling: true });
  const { tradeToken, onTrade, setTradeToken } = useTrade();

  const [currentBg, setCurrentBg] = useState(BG_LIST[1]);
  const [currentBgIdx, setCurrentBgIdx] = useState(1);
  const [visible, setVisible] = useState(false);

  const handleBuy = () => {
    if (!top1) return;
    onTrade(top1);
    setVisible(true);
  };

  const handleBuyClose = () => {
    setVisible(false);
    setTradeToken({});
  };

  useEffect(() => {
    const setBg = () => {
      let _currentBgIdx = currentBgIdx + 1;
      if (_currentBgIdx > BG_LIST.length - 1) {
        _currentBgIdx = 0;
      }
      setCurrentBg(BG_LIST[_currentBgIdx]);
      setCurrentBgIdx(_currentBgIdx);
    };
    const timer = setInterval(setBg, 3000);
    return () => {
      clearInterval(timer);
    }
  }, [currentBgIdx]);

  return (
    <div>
      <motion.div
        className={styles.Container}
        initial={{ backgroundImage: BG_LIST[0] }}
        animate={{
          backgroundImage: currentBg,
        }}
        transition={{
          duration: 3,
        }}
      >
        <div
          className={styles.Avatar}
          style={{ backgroundImage: `url("${top1?.Icon}")` }}
        >
          <img src="/img/trends/crown-laptop.svg" alt="" className={styles.Crown} />
        </div>
        <div className={styles.Content}>
          <div className={styles.Title}>
            <div className={styles.Name}>
              {top1?.token_symbol}
            </div>
            <div className={styles.Rank}>
              [KING OF THE HILL]
            </div>
          </div>
          <div className={styles.Summaries}>
            <div className={styles.Summary}>
              <div className={styles.SummaryLabel}>
                [Market Cap]
              </div>
              <div className={styles.SummaryValue}>
                {numberFormatter(top1?.market_value, 2, true, { prefix: '$', isShort: true })}
              </div>
            </div>
            <div className={styles.Summary}>
              <div className={styles.SummaryLabel}>
                [Progress]
              </div>
              <div className={styles.SummaryValue}>
                0%
              </div>
            </div>
            <div className={styles.Summary}>
              <div className={styles.SummaryValue}>
                Created in {top1?.created2Now}
              </div>
            </div>
            <div className={styles.TradeContainer}>
              <button
                type="button"
                className={styles.Trade}
                onClick={handleBuy}
              >
                <img src="/img/trends/buy.svg" alt="" className={styles.TradeIcon} />
                <div className="">BUY</div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <BuyModal
        visible={visible}
        tradeToken={tradeToken}
        onClose={handleBuyClose}
      />
    </div>
  );
};

export default TrendBanner;

const BG_LIST = [
  'linear-gradient(90deg, #5900FF 0%, rgba(255, 38, 129, 0.00) 100%)',
  'linear-gradient(90deg, #00E4A8 0%, rgba(255, 38, 129, 0.00) 100%)',
  'linear-gradient(90deg, #FB00FF 0%, rgba(255, 38, 129, 0.00) 100%)',
];
