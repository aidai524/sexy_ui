import styles from "./index.module.css";
import { formatLongText } from '@/app/utils/common';
import { useEffect, useMemo, useRef } from 'react';

export default function Top(props: Props) {
  const { onBuy } = props;

  const [top1Name, top1Ticker, top1TickerAvatar] = useMemo(() => {
    const _top1Name = 'VVAU';
    const _top1Ticker = 'VVAVVAVVAVVAVVAVVAVVAVVAVVAVVA';
    const _top1TickerAvatar = '/192x192.png';
    return [_top1Name, _top1Ticker, _top1TickerAvatar];
  }, []);

  const topBadgesRef = useRef<any>();

  useEffect(() => {
    if (!topBadgesRef.current) return;
    const scrollWidth = topBadgesRef.current.scrollWidth;
    const clientWidth = topBadgesRef.current.clientWidth;
    if (scrollWidth <= clientWidth) return;
    const timer1 = setInterval(() => {
      topBadgesRef.current.scrollTo({
        left: scrollWidth,
        behavior: 'smooth',
      });
    }, 4000);
    const timer2 = setInterval(() => {
      topBadgesRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }, 8000);
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, [topBadgesRef]);

  return (
    <div className={styles.Top}>
      <div className={styles.TopAvatar}>
        <div className={styles.TopSummary}>
          <div className={[styles.Badge, styles.TopSummaryLike].join(' ')}>
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.3 6.10352e-05C1.47746 6.10352e-05 0 1.4348 0 3.20461C0 6.40916 3.9 9.32239 6 10.0001C8.1 9.32239 12 6.40916 12 3.20461C12 1.4348 10.5225 6.10352e-05 8.7 6.10352e-05C7.58391 6.10352e-05 6.59721 0.538105 6 1.36165C5.40279 0.538105 4.41609 6.10352e-05 3.3 6.10352e-05Z"
                fill="#FF3499"
              />
            </svg>
            <div>5.23K</div>
          </div>
          <div className={styles.Badge}>
            Holder 2.2K
          </div>
        </div>
        <img src="/img/trends/crown.svg" alt="" className={styles.TopCrown} />
      </div>
      <div className={styles.TopInfo}>
        <div className={styles.TopName} title={top1Name}>
          {formatLongText(top1Name)}
        </div>
        <div className={styles.TopTicker}>
          <div className={styles.TopTickerLabel}>
            Ticker:
          </div>
          <div className={styles.TopTickerAvatar} style={{ backgroundImage: `url("${top1TickerAvatar}")` }} />
          <div className={styles.TopTickerName} title={top1Ticker}>
            {formatLongText(top1Ticker, 2, 1)}
          </div>
        </div>
      </div>
      <div className={styles.TopBadges} ref={topBadgesRef}>
        <div className={[styles.Badge, styles.TopBadge].join(' ')}>
          Created in 33 mins
        </div>
        <div className={[styles.Badge, styles.TopBadge].join(' ')}>
          <div>Created by</div>
          <div style={{ color: '#FF37A3' }}>satoshldog</div>
        </div>
      </div>
      <div className={styles.TopMarketCap}>
        <div className={styles.TopMarketCapLabel}>
          Market Cap:
        </div>
        <div className={styles.TopMarketCapValue}>
          $2,450,230.45
        </div>
      </div>
      <div className={styles.TopBuy}>
        <button
          type="button"
          className={styles.TopBuyBtn}
          onClick={onBuy}
        >
          <img src="/img/trends/buy.svg" alt="" className={styles.TopBuyBtnIcon} />
          <div>BUY</div>
        </button>
      </div>
    </div>
  );
}

interface Props {
  onBuy?(): void;
}
