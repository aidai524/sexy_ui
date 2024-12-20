import styles from "./index.module.css";
import { formatLongText } from '@/app/utils/common';

export default function Item(props: Props) {
  const { onBuy } = props;

  const name = 'GOTH WOMANGOTH WOMANGOTH WOMANGOTH WOMANGOTH WOMAN';
  const ticker = 'GTWMGTWMGTWMGTWMGTWMGTWM';

  return (
    <div className={styles.Item}>
      <div
        className={styles.ItemAvatar}
        style={{ backgroundImage: `url("/512x512.png")` }}
      />
      <div className={styles.ItemContent}>
        <div className={styles.ItemHead}>
          <div className={styles.ItemHeadInfo}>
            <div className={styles.ItemHeadName} title={name}>
              {formatLongText(name, 8, 4)}
            </div>
            <div className={styles.ItemHeadTicker}>
              <div className={styles.ItemHeadTickerName} title={ticker}>
                Ticker: {formatLongText(ticker, 5, 3)}
              </div>
              <div
                className={styles.ItemHeadTickerAvatar}
                style={{ backgroundImage: `url("/512x512.png")` }}
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
            4.25K
          </div>
        </div>
        <div className={styles.ItemCreateTime}>
          18m ago
        </div>
      </div>
    </div>
  );
}

interface Props {
  onBuy?(): void;
}
