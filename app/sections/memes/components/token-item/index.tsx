import styles from './index.module.css';
import clsx from 'clsx';
import TokenIcon from '@/app/components/avatar/token';
import SummaryItem from '@/app/sections/memes/components/summary-item';
import { formatLongText, numberFormatter } from '@/app/utils/common';
import Countdown from '@/app/sections/memes/components/countdown';
import { Hot, Meme } from '@/app/sections/memes/store/list';
import { Skeleton } from 'antd-mobile'

const TokenItem = (props: { className?: string; token: Hot | Meme; }) => {
  const { className, token } = props;

  return (
    <div className={clsx(styles.TokenItemContainer, className)}>
      <div className={styles.TokenItemLeft}>
        <TokenIcon
          token={token.kind === 'Meme' ? {
            ...token,
            is_king: false,
            icon: token.icon || token.video,
            bondingProgress: token.bonding_progress,
          } : {
            ...token,
            is_king: false,
            icon: token.Icon,
            bondingProgress: token.progress,
          }}
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
          {
            token.kind === 'Hot' && (
              <div className={styles.TokenItemMarketCap}>
                MC {numberFormatter(token.market_cap, 2, true, { prefix: '$', isShort: true, isShortUppercase: true })}
              </div>
            )
          }
          {/*<Countdown />*/}
        </div>
        <div className={styles.TokenItemFoot}>
          <div className={styles.TokenItemSummaries}>
            {
              token.kind === 'Hot' && (
                <>
                  {
                    [0, 1, 2].includes(token.status) ? (
                      <SummaryItem
                        className={styles.TokenItemSummary}
                        type="rocket"
                        value={token.like || 0}
                      />
                    ) : (
                      <SummaryItem
                        className={styles.TokenItemSummary}
                        type="plane"
                        value={token.like || 0}
                      />
                    )
                  }
                  <SummaryItem
                    className={styles.TokenItemSummary}
                    type="user"
                    value={token.holder || 0}
                  />
                </>
              )
            }
            {
              token.kind === 'Meme' && (
                <>
                  <SummaryItem
                   className={styles.TokenItemSummary}
                   type="like"
                   value={token.like || 0}
                   />
                  <SummaryItem
                   className={styles.TokenItemSummary}
                   type="flip"
                   value={token.pre_paid || 0}
                   />
                </>
              )
            }
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

export const TokenItemLoading = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx(styles.TokenItemContainer, className)}>
      <div className={styles.TokenItemLeft}>
        <Skeleton animated className={styles.TokenItemSkeletonAvatar} />
      </div>
      <div className={styles.TokenItemRight}>
        <div className={styles.TokenItemProfile}>
          <Skeleton animated className={styles.TokenItemSkeletonName} />
          <Skeleton animated className={styles.TokenItemSkeletonName} />
        </div>
        <div className={styles.TokenItemFoot}>
          <Skeleton animated className={styles.TokenItemSkeletonName} />
          <Skeleton animated className={styles.TokenItemSkeletonTime} />
        </div>
      </div>
    </div>
  );
};
