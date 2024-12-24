import styles from './index.module.css';

const HottestItem = () => {

  return (
    <div className={styles.Container}>
      <div className={styles.Card}>
        <div
          className={styles.Avatar}
          style={{ backgroundImage: `url("/192x192.png")` }}
        >
          <img src="/img/trends/crown-second.svg" alt="" className={styles.AvatarIcon} />
        </div>
        <div className={styles.Info}>
          <div className={styles.Name}>
            GOTH WOMAN
          </div>
          <div className={styles.LabelItem}>
            <div className="">Ticker: GTWM</div>
            <img src="/192x192.png" alt="" className={styles.TickerAvatar} />
          </div>
          <div className={styles.LabelItem}>
            <div className={styles.Label}>Market cap:</div>
            <div className={styles.Value}>4.25K</div>
          </div>
          <div className={styles.LabelItem}>
            <div className={styles.Label}>
              18m ago
            </div>
          </div>
        </div>
      </div>
      <div className={styles.Foot}>
        <button
          type="button"
          className={styles.BuyBtn}
        >
          <img src="/img/trends/buy-normal.svg" alt="" className={styles.BuyBtnIcon} />
          <div>BUY</div>
        </button>
      </div>
    </div>
  );
};

export default HottestItem;
