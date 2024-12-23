import styles from "./index.module.css";
import { formatLongText, numberFormatter } from '@/app/utils/common';
import { Trend } from '@/app/sections/trends/hooks';

export default function Item(props: Props) {
  const { onBuy, trend } = props;

  const name = trend?.token_symbol;
  const ticker = trend?.ticker;
  const icon = trend?.Icon;
  const tickerAvatar = '';
  const marketVal = trend?.market_value;

  return (
    <div className={styles.Item}>
      <div
        className={styles.ItemAvatar}
        style={{ backgroundImage: `url("${icon}")` }}
      />
      <div className={styles.ItemContent}>
        <div className={styles.ItemHead}>
          <div className={styles.ItemHeadInfo}>
            <div className={styles.ItemHeadName} title={name}>
              {formatLongText(name, 8, 4)}
            </div>
            <div className={styles.ItemHeadTicker}>
              <div className={styles.ItemHeadTickerName} title={ticker}>
                Ticker: {formatLongText(ticker, 10, 6)}
              </div>
              <div
                className={styles.ItemHeadTickerAvatar}
                style={{ backgroundImage: `url("${tickerAvatar}")` }}
              />
            </div>
          </div>
          <div className={styles.ItemHeadBuy}>
            <button
              type="button"
              className={styles.ItemHeadBuyBtn}
              onClick={onBuy}
            >
              <img src="/img/trends/buy-normal.svg" alt="" className={styles.ItemHeadBuyBtnIcon} />
              <div>BUY</div>
            </button>
          </div>
        </div>
        <div className={styles.ItemMarketCap}>
          <div className={styles.ItemMarketCapLabel}>
            Market cap:
          </div>
          <div className={styles.ItemMarketCapValue}>
            {numberFormatter(marketVal, 2, true, { prefix: '$', isShort: true, isShortUppercase: true })}
          </div>
        </div>
        <div className={styles.ItemCreateTime}>
          {trend?.created2Now}
        </div>
      </div>
    </div>
  );
}

interface Props {
  trend?: Trend;
  onBuy?(): void;
}
