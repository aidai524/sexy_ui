import styles from "./index.module.css";
import { formatLongText, numberFormatter } from '@/app/utils/common';
import { useEffect, useMemo, useRef } from 'react';
import { Trend } from '@/app/sections/trends/hooks';
import Big from 'big.js';

export default function Top(props: Props) {
  const { onBuy, trend, isMobile } = props;

  const [top1Name, top1Ticker, top1Icon, top1TickerAvatar, top1Likes, top1Holders, top1CreateBy] = useMemo(() => {
    const _top1Name = trend?.token_symbol;
    const _top1Ticker = trend?.ticker;
    const _top1Icon = trend?.Icon;
    const _top1Like = numberFormatter(trend?.like, 0, true, { isShort: true });
    const _createBy = formatLongText(trend?.address, 3, 4);
    return [_top1Name, _top1Ticker, _top1Icon, '', _top1Like, '0', _createBy];
  }, [trend]);

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
  }, [topBadgesRef, trend]);

  return isMobile ? (
    <div className={styles.Top}>
      <div className={styles.TopAvatar} style={{ backgroundImage: `url("${top1Icon}")` }}>
        <div className={styles.TopSummary}>
          <div className={[styles.Badge, styles.TopSummaryLike].join(' ')}>
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.3 6.10352e-05C1.47746 6.10352e-05 0 1.4348 0 3.20461C0 6.40916 3.9 9.32239 6 10.0001C8.1 9.32239 12 6.40916 12 3.20461C12 1.4348 10.5225 6.10352e-05 8.7 6.10352e-05C7.58391 6.10352e-05 6.59721 0.538105 6 1.36165C5.40279 0.538105 4.41609 6.10352e-05 3.3 6.10352e-05Z"
                fill="#FF3499"
              />
            </svg>
            <div>{top1Likes}</div>
          </div>
          <div className={styles.Badge}>
            Holder {top1Holders}
          </div>
        </div>
        <img src="/img/trends/crown.svg" alt="" className={styles.TopCrown} />
      </div>
      <div className={styles.TopInfo}>
        <div className={styles.TopName} title={top1Name}>
          {formatLongText(top1Name, 8, 4)}
        </div>
        <div className={styles.TopTicker}>
          <div className={styles.TopTickerLabel}>
            Ticker:
          </div>
          {
            top1TickerAvatar && (
              <div className={styles.TopTickerAvatar} style={{ backgroundImage: `url("${top1TickerAvatar}")` }} />
            )
          }
          <div className={styles.TopTickerName} title={top1Ticker}>
            {formatLongText(top1Ticker, 8, 2)}
          </div>
        </div>
      </div>
      <div className={styles.TopBadges} ref={topBadgesRef}>
        <div className={[styles.Badge, styles.TopBadge].join(' ')}>
          Created in {trend?.created2Now?.replace?.(/ago$/, '')}
        </div>
        <div className={[styles.Badge, styles.TopBadge].join(' ')}>
          <div>Created by</div>
          <div style={{ color: '#FF37A3' }}>{top1Ticker}</div>
        </div>
      </div>
      <div className={styles.TopMarketCap}>
        <div className={styles.TopMarketCapLabel}>
          Market Cap:
        </div>
        <div className={styles.TopMarketCapValue}>
          {numberFormatter(trend?.market_cap, 2, true, { prefix: '$', isShort: Big(trend?.market_value || 0).gt(1e10) })}
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
  ) : (
    <div className={styles.LaptopTop}>
      <div className={styles.LaptopTopAvatarContainer}>
        <div
          className={styles.LaptopTopAvatar}
          style={{ backgroundImage: `url("${top1Icon}")` }}
        >
          <img src="/img/trends/crown-normal.svg" alt="" className={styles.LaptopTopAvatarCrown} />
        </div>
      </div>
      <div className={styles.LaptopTopContent}>
        <div className={styles.LaptopTopContentInfo}>
          <div className={styles.LaptopTopName}>
            {top1Name}
          </div>
          <div className={styles.LaptopTopTicker}>
            <div className={styles.LaptopTopTickerItem}>
              <div className={styles.LaptopTopTickerLabel}>
                Ticker:
              </div>
              <div className={styles.LaptopTopTickerValue}>
                {
                  top1TickerAvatar && (
                    <img src={top1TickerAvatar} alt="" className={styles.LaptopTopTickerAvatar} />
                  )
                }
                <div>{top1Ticker}</div>
              </div>
            </div>
            <div className={styles.LaptopTopTickerItem} style={{ marginLeft: 24 }}>
              <div className={styles.LaptopTopTickerLabel}>
                Create by:
              </div>
              <div className={styles.LaptopTopTickerValue}>
                <img src="/192x192.png" alt="" className={styles.LaptopTopTickerAvatar} />
                <div>{top1CreateBy}</div>
              </div>
            </div>
            <div className={styles.LaptopTopTickerItem}>
              <div className={styles.LaptopTopTickerTime}>
                {trend?.created2Now}
              </div>
            </div>
          </div>
          <div className={styles.LaptopTopMarketCap}>
            <div className={styles.LaptopTopMarketCapValue}>
              <div className="">
                {numberFormatter(trend?.market_cap, 2, true, { prefix: '$', isShort: Big(trend?.market_value || 0).gt(1e10) })}
              </div>
              <div className={styles.LaptopTopMarketCapTrend}>
                +{trend?.market_cap_percentage}%
              </div>
            </div>
            <div className={styles.LaptopTopMarketCapLabel}>
              [Market cap]
            </div>
          </div>
          <div className={styles.LaptopTopSummaries}>
            <div className={styles.LaptopTopBadge}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M3.3 0C1.47746 0 0 1.43474 0 3.20455C0 6.4091 3.9 9.32233 6 10C8.1 9.32233 12 6.4091 12 3.20455C12 1.43474 10.5225 0 8.7 0C7.58391 0 6.59721 0.538044 6 1.36158C5.40279 0.538044 4.41609 0 3.3 0Z"
                  fill="#FF3499"
                />
              </svg>
              <div>{top1Likes}</div>
            </div>
            <div className={[styles.LaptopTopBadge, styles.LaptopTopBadgeGreen].join(' ')}>
              Holder {top1Holders}
            </div>
          </div>
        </div>
        <div className={styles.LaptopTopContentBuy}>
          <button
            type="button"
            className={styles.LaptopTopContentBuyBtn}
            onClick={onBuy}
          >
            <img src="/img/trends/buy.svg" alt="" className={styles.LaptopTopContentBuyBtnIcon} />
            <div>BUY</div>
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  trend?: Trend;
  isMobile?: boolean;

  onBuy?(): void;
}
