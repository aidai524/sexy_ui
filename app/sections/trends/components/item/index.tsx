import styles from "./index.module.css";
import { formatLongText, numberFormatter } from "@/app/utils/common";
import { Trend } from "@/app/sections/trends/hooks";
import { useCreator } from "@/app/sections/trends/hooks/creator";
import { useUserAgent } from "@/app/context/user-agent";
import { useRouter } from "next/navigation";
import Media from "@/app/components/thumbnail/media";

export default function Item(props: Props) {
  const { onBuy, trend } = props;
  const { isMobile } = useUserAgent();
  const creator = useCreator();
  const router = useRouter();
  const name = trend?.token_symbol;
  const ticker = trend?.ticker;
  const icon = trend?.Icon;
  const tickerAvatar = trend?.Icon;
  const marketCap = trend?.market_cap;

  return (
    <div className={isMobile ? styles.Item : styles.PcItem}>
      <div
        className={`${styles.ItemAvatar} button`}
        // style={{ backgroundImage: `url("${icon}")` }}
        onClick={() => creator.onDetail(trend?.address)}
      >
        <Media
          data={{ tokenImg: icon }}
          autoPlay={false}
          imgStyle={{
            height: 86,
            width: 86,
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 8,
          }}
        />
        {
          props.index === 0 && (
            <img
              src="/img/trends/crown-second.svg"
              alt=""
              className={styles.secondaryTrendIcon}
            />
          )
        }
      </div>

      <div className={styles.ItemContent}>
        <div className={styles.ItemHead}>
        <div className={styles.ItemHeadInfo}>
            <div
              className={styles.ItemHeadName}
              title={name}
              onClick={() => creator.onDetail(trend?.address)}
            >
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
              <img
                src="/img/trends/buy-normal.svg"
                alt=""
                className={styles.ItemHeadBuyBtnIcon}
              />
              <div>BUY</div>
            </button>
          </div>
        </div>
        <div className={styles.ItemMarketCap}>
          <div className={styles.ItemMarketCapLabel}>Market cap:</div>
          <div className={styles.ItemMarketCapValue}>
            {numberFormatter(marketCap, 2, true, {
              prefix: "$",
              isShort: true,
              isShortUppercase: true
            })}
          </div>
        </div>
        {!isMobile ? (
          <div className={styles.ItemCreateTime}>
            Created by{" "}
            <span
              className={`${styles.ItemCreateTimePrimary} button`}
              onClick={() => {
                if (trend?.project_creator) {
                  router.push(`/profile/user?account=${trend.project_creator}&from=trends`);
                }
              }}
            >
              {formatLongText(
                trend?.creator_name || trend?.project_creator,
                3,
                4
              )}
            </span>{" "}
            {trend?.created2Now?.replace(/\sago$/, "")}
          </div>
        ) : (
          <div className={styles.ItemCreateTime}>{trend?.created2Now}</div>
        )}
      </div>
    </div>
  );
}

interface Props {
  trend?: Trend;
  index?: number;
  onBuy?(): void;
}
