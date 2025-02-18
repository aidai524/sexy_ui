import styles from './index.module.css';
import clsx from 'clsx';
import TokenIcon from '@/app/components/avatar/token';
import SummaryItem from '@/app/sections/memes/components/summary-item';
import { formatLongText, numberFormatter } from '@/app/utils/common';
import Countdown from '@/app/sections/memes/components/countdown';
import { Meme } from '@/app/sections/memes/store/meme';

const TokenItem = (props: { className?: string; token: Meme; }) => {
  const { className, token } = props;

  return (
    <div className={clsx(styles.TokenItemContainer, className)}>
      <div className={styles.TokenItemLeft}>
        <TokenIcon
          token={{ ...token, is_king: false }}
        />
      </div>
      <div className={styles.TokenItemRight}>
        <div className={styles.TokenItemProfile}>
          <div className={styles.TokenItemName}>
            <div>{formatLongText(token.token_symbol, 6, 6)}</div>
            {
              token.is_king ? (
                <div className={styles.TokenItemNameIcon}>👑</div>
              ) : (
                !!token.last_king_time && (
                  <img src="/img/trends/crown-second.svg" alt="" className={styles.TokenItemNameIconCrown} />
                )
              )
            }
          </div>
          <div className={styles.TokenItemMarketCap}>
            MC {numberFormatter(token.market_cap, 2, true, { prefix: '$', isShort: true, isShortUppercase: true })}
          </div>
          {/*<Countdown />*/}
        </div>
        <div className={styles.TokenItemFoot}>
          <div className={styles.TokenItemSummaries}>
            <SummaryItem
              className={styles.TokenItemSummary}
              type="rocket"
              value={2}
            />
            <SummaryItem
              className={styles.TokenItemSummary}
              type="user"
              value={1234}
            />
            <SummaryItem
              className={styles.TokenItemSummary}
              type="plane"
              value={1234}
            />
            {/*<SummaryItem
              className={styles.TokenItemSummary}
              type="like"
              value={1234}
            />*/}
            {/*<SummaryItem
              className={styles.TokenItemSummary}
              type="flip"
              value={1234}
            />*/}
          </div>
          <div className={styles.TokenItemCreateAt}>
            {token.created2Now}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
