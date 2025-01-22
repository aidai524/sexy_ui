import styles from "./index.module.css";
import { formatLongText, numberFormatter } from "@/app/utils/common";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trend } from "@/app/sections/trends/hooks";
import Big from "big.js";
import { useCreator } from "@/app/sections/trends/hooks/creator";
import { motion } from "framer-motion";
import Likes from "@/app/components/thumbnail/likes";
import Carousel from "@/app/sections/trends/components/carousel";
import AvatarBg from "./avatar-bg";
import useHolders from '@/app/sections/home/mobile/hooks/use-holders';
import Media from '@/app/components/thumbnail/media';

export default function Top(props: Props) {
  const { onBuy, trend, isMobile, loading } = props;

  const creator = useCreator();
  const { total: top1Holders } = useHolders(trend);

  const [
    top1Name,
    top1Ticker,
    top1Icon,
    top1TickerAvatar,
    top1Likes,
    top1CreateBy
  ] = useMemo(() => {
    const _top1Name = trend?.token_symbol;
    const _top1Ticker = trend?.ticker;
    const _top1Icon = trend?.Icon;
    const _top1Like = numberFormatter(trend?.like, 2, true, { isShort: true });
    const _createBy = formatLongText(
      trend?.creator_name || trend?.project_creator,
      3,
      4
    );
    return [
      _top1Name,
      _top1Ticker,
      _top1Icon,
      trend?.Icon,
      _top1Like,
      _createBy
    ];
  }, [trend]);

  const topBadgesRef = useRef<any>();
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!topBadgesRef.current) return;
    const scrollWidth = topBadgesRef.current.scrollWidth;
    const offsetWidth = topBadgesRef.current.offsetWidth;
    if (scrollWidth <= offsetWidth) return;
    setContentWidth(scrollWidth - offsetWidth);
  }, [topBadgesRef, trend]);

  return (
    <div
      className={styles.Top}
      style={{
        marginTop: isMobile ? 106 : 30
      }}
    >
      {isMobile && <Carousel />}
      <div className={styles.TopAvatar}>
        {!isMobile && <AvatarBg className={styles.TopAvatarBg} />}
        <div
          className={styles.TopAvatarContent}
          onClick={() => creator.onDetail(trend?.address)}
        >
          <Media
            data={{ tokenImg: top1Icon }}
            autoPlay={false}
            imgStyle={{
              height: 210,
              width: 210,
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: 20,
            }}
          />
          {!isMobile && (
            <div className={styles.PcCarouselWrapper}>
              <Carousel />
            </div>
          )}
          <div className={styles.TopSummary}>
            {/*<div className={[styles.Badge, styles.TopSummaryLike].join(' ')}>
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
      </div>*/}
            {!loading && isMobile && (
              <Likes
                data={
                  {
                    ...trend,
                    initiativeLaunching: trend?.initiative_launching,
                    DApp: "sexy",
                    status: 1
                  } as any
                }
                showShare={false}
                likeNumsStyle={{
                  padding: 0
                }}
                style={{
                  padding: 0
                }}
                likesNumsStyle={{
                  flexShrink: 0,
                  whiteSpace: "nowrap"
                }}
              />
            )}
          </div>
          {
            !isMobile && (
              <img
                src="/img/trends/crown.svg"
                alt=""
                className={styles.TopCrown}
              />
            )
          }
        </div>
      </div>
      <div className={styles.TopInfo}>
        <div className={styles.TopName} title={top1Name}>
          {formatLongText(top1Name, 8, 4)}
        </div>
        <div className={styles.TopTicker}>
          <div className={styles.TopTickerLabel}>Ticker:</div>
          {top1TickerAvatar && (
            <div
              className={styles.TopTickerAvatar}
              style={{ backgroundImage: `url("${top1TickerAvatar}")` }}
            />
          )}
          <div className={styles.TopTickerName} title={top1Ticker}>
            {formatLongText(top1Ticker, 8, 2)}
          </div>
        </div>
      </div>
      <motion.div className={styles.TopBadges} ref={topBadgesRef}>
        <motion.div
          className={styles.TopBadgesInner}
          style={{
            justifyContent:
              topBadgesRef.current?.scrollWidth >
              topBadgesRef.current?.offsetWidth
                ? "flex-start"
                : "center"
          }}
          animate={
            topBadgesRef.current?.scrollWidth >
            topBadgesRef.current?.offsetWidth
              ? {
                  x: [10, -contentWidth - 10, 10]
                }
              : {}
          }
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity
          }}
        >
          <div className={[styles.Badge, styles.TopBadge].join(" ")}>
            Created in {trend?.created2Now?.replace?.(/ago$/, "")}
          </div>
          <div
            className={[styles.Badge, styles.TopBadge, styles.TopBadgeClickable].join(" ")}
            onClick={() => {
              creator.onClick(trend?.project_creator);
            }}
          >
            <div>Created by</div>
            <div style={{ color: "#FBCA04" }}>{top1CreateBy}</div>
          </div>
          {!isMobile && (
            <div className={styles.Badge}>Holder {top1Holders}</div>
          )}
        </motion.div>
      </motion.div>
      <div className={styles.TopMarketCap}>
        <div className={styles.TopMarketCapLabel}>Market Cap:</div>
        <div className={styles.TopMarketCapValue}>
          {numberFormatter(trend?.market_cap, 2, true, {
            prefix: "$",
            isShort: Big(trend?.market_cap || 0).gt(1e10)
          })}
        </div>
      </div>
      <div className={styles.TopBuy}>
        <button type="button" className={styles.TopBuyBtn} onClick={onBuy} />
      </div>
    </div>
  );
}

interface Props {
  trend?: Trend;
  isMobile?: boolean;
  loading?: boolean;

  onBuy?(): void;
}
