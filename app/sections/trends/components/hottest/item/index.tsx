import styles from "./index.module.css";
import { Trend } from '@/app/sections/trends/hooks';
import { numberFormatter } from '@/app/utils/common';

const HottestItem = (props: { trend: Trend; index: number; onBuy(trend: Trend): Promise<void>; }) => {
  const { trend, index, onBuy } = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <div
          className={styles.Avatar}
          style={{ backgroundImage: `url("${trend.Icon}")` }}
        >
          {
            index === 0 && (
              <img
                src="/img/trends/crown-second.svg"
                alt=""
                className={styles.AvatarIcon}
              />
            )
          }
        </div>
        <div className={styles.Info}>
          <div className={styles.Name}>{trend.token_symbol}</div>
          <div className={styles.LabelItem}>
            <div className="">Ticker: {trend.ticker}</div>
            {/*<img src="/192x192.png" alt="" className={styles.TickerAvatar} />*/}
          </div>
          <div className={styles.LabelItem}>
            <div className={styles.Label}>Market cap:</div>
            <div className={styles.Value}>
              {numberFormatter(trend.market_cap, 2, true, { prefix: '$', isShort: true })}
            </div>
          </div>
          <div className={styles.LabelItem}>
            <div className={styles.Label}>{trend.created2Now}</div>
          </div>
        </div>
      </div>
      <div className={styles.Foot}>
        <button type="button" className={styles.BuyBtn} onClick={() => onBuy(trend)}>
          <img
            src="/img/trends/buy-normal.svg"
            alt=""
            className={styles.BuyBtnIcon}
          />
          <div>BUY</div>
        </button>
      </div>
    </div>
  );
};

export default HottestItem;
