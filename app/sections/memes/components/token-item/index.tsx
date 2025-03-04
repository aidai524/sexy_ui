import styles from "./index.module.css";
import clsx from "clsx";
import TokenIcon from "@/app/components/avatar/token";
import SummaryItem from "@/app/sections/memes/components/summary-item";
import {
  formatLongText,
  isVideoFile,
  numberFormatter
} from "@/app/utils/common";
import Countdown from "@/app/sections/memes/components/countdown";
import { Hot, Meme } from "@/app/sections/memes/store/list";
import { Skeleton } from "antd-mobile";
import { useUserAgent } from "@/app/context/user-agent";
import VideoPlayer from "@/app/components/video";
import { getVideoExt } from "@/app/components/upload";
import { useContext, useMemo, useState } from 'react';
import Big from "big.js";
import { useRouter } from 'next/navigation';
import { MemesContext } from '@/app/sections/memes/context';

const TokenItem = (props: { className?: string; token: Hot | Meme }) => {
  const { className, token } = props;

  const { isMobile } = useUserAgent();
  const router = useRouter();

  const _token = useMemo(() => {
    return token.kind === "Meme"
      ? {
          ...token,
          icon: token.icon || token.video,
          bondingProgress: token.bonding_progress
        }
      : {
          ...token,
          icon: token.Icon || token.video,
          bondingProgress: token.progress
        };
  }, [token]);

  return (
    <div
      className={clsx(styles.TokenItemContainer, className)}
      onClick={() => {
        router.push(`/detail?address=${token?.address}`);
      }}
    >
      {!isMobile && (
        <div className={styles.TokenItemLaptopAvatar}>
          {
            isVideoFile(_token.video) ? (
              _token.icon ? (
                <div className={styles.TokenItemLaptopAvatarBannerWithPlayButton}>
                  <img
                    src={_token?.icon || "/img/token-placeholder.png"}
                    alt=""
                    className={styles.TokenItemLaptopAvatarBanner}
                    loading="lazy"
                  />
                  <div className={styles.TokenItemLaptopAvatarBannerPlayButtonContainer}>
                    <img src="/img/icon-play.svg" alt="" className={styles.TokenItemLaptopAvatarBannerPlayButton} />
                  </div>
                </div>
              ) : (
                <VideoPlayer
                  key={_token.video}
                  id={String(_token.id)}
                  mediaId={`TokenItemLaptopAvatar-${_token.id}`}
                  src={_token.video}
                  type={getVideoExt(_token.video)}
                  className={styles.TokenItemLaptopAvatarBanner}
                  autoPlay={true}
                  token={_token as any}
                />
              )
            ) : (
              <div className={styles.TokenItemLaptopAvatarBannerWithPlayButton}>
                <img
                  src={_token?.icon || "/img/token-placeholder.png"}
                  alt=""
                  className={styles.TokenItemLaptopAvatarBanner}
                  loading="lazy"
                />
              </div>
            )
          }
          <div className={styles.TokenItemLaptopAvatarProfile}>
            <div className={styles.TokenItemLaptopAvatarProfileLeft}>
              <TokenIcon
                className={styles.TokenItemLaptopAvatarCorner}
                token={{
                  ..._token,
                  is_king: false
                }}
              />
              <div
                className={styles.TokenItemLaptopAvatarProfileSymbol}
                title={_token.token_symbol}
              >
                {formatLongText(_token.token_symbol, 2, 4)}
              </div>
            </div>
            <div className={styles.TokenItemLaptopAvatarProfileRight}>
              <div className={styles.TokenItemCreateAt}>
                {token.created2Now?.replace(/ago$/i, "")}
              </div>
            </div>
          </div>
          <div className={styles.TokenItemLaptopAvatarCrown}>
            {_token?.is_king
              ? "👑"
              : !!_token?.last_king_time && (
                  <img
                    src="/img/memes/icon-crown.svg"
                    alt=""
                    className={styles.TokenItemLaptopAvatarCrownIcon}
                  />
                )}
          </div>
        </div>
      )}

      {isMobile ? (
        <>
          <div className={styles.TokenItemLeft}>
            <TokenIcon
              token={{
                ..._token,
                icon: isVideoFile(_token.video) ? (_token.icon || _token.video) : _token.video,
                is_king: false
              }}
              isPlayButton={true}
            />
          </div>
          <div className={styles.TokenItemRight}>
            <div className={styles.TokenItemProfile}>
              <div className={styles.TokenItemName}>
                <div>{formatLongText(token.token_symbol, 6, 6)}</div>
                {token.is_king ? (
                  <div className={styles.TokenItemNameIcon}>👑</div>
                ) : (
                  !!token.last_king_time && (
                    <img
                      src="/img/trends/crown-second.svg"
                      alt=""
                      className={styles.TokenItemNameIconCrown}
                    />
                  )
                )}
              </div>
              <TokenItemMarketCap token={token} />
            </div>
            <div className={styles.TokenItemFoot}>
              <TokenItemSummaries token={token} />
              <div className={styles.TokenItemCreateAt}>
                {token.created2Now}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.TokenItemLaptopFooter}>
          <TokenItemMarketCap token={token} />
          <TokenItemSummaries token={token} />
        </div>
      )}
    </div>
  );
};

export default TokenItem;

export const TokenItemLoading = (props: any) => {
  const { className } = props;

  const { isMobile } = useUserAgent();

  return (
    <div className={clsx(styles.TokenItemContainer, className)}>
      {isMobile ? (
        <>
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
        </>
      ) : (
        <>
          <div className={styles.TokenItemSkeletonTopLaptop}>
            <Skeleton
              animated
              className={styles.TokenItemSkeletonAvatarLaptop}
            />
            <div className={styles.TokenItemSkeletonAvatarProfileLaptop}>
              <div className={styles.TokenItemSkeletonAvatarProfileLeftLaptop}>
                <Skeleton animated className={styles.TokenItemSkeletonAvatar} />
                <Skeleton
                  animated
                  className={styles.TokenItemSkeletonNameLaptop}
                />
              </div>
              <Skeleton
                animated
                className={styles.TokenItemSkeletonCreateTimeLaptop}
              />
            </div>
          </div>
          <div className={styles.TokenItemSkeletonFooterLaptop}>
            <Skeleton
              animated
              className={styles.TokenItemSkeletonMarketCapLaptop}
            />
            <div className={styles.TokenItemSkeletonSummariesLaptop}>
              <Skeleton
                animated
                className={styles.TokenItemSkeletonSummaryLaptop}
              />
              <Skeleton
                animated
                className={styles.TokenItemSkeletonSummaryLaptop}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const TokenItemSummaries = (props: any) => {
  const { className, token } = props;

  return (
    <div className={clsx(styles.TokenItemSummaries, className)}>
      {token.kind === "Hot" && (
        <>
          {[0, 1, 2].includes(token.status) ? (
            <SummaryItem
              className={styles.TokenItemSummary}
              type="rocket"
              value={token.launched_like || 0}
            />
          ) : (
            <SummaryItem
              className={styles.TokenItemSummary}
              type="plane"
              value={token.launched_like || 0}
            />
          )}
          <SummaryItem
            className={styles.TokenItemSummary}
            type="user"
            value={token.holder || 0}
          />
        </>
      )}
      {token.kind === "Meme" && (
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
      )}
    </div>
  );
};

export const TokenItemMarketCap = (props: any) => {
  const { token } = props;
  const { setMemesListCountdown } = useContext(MemesContext);

  const [countdownFinished, setCountdownFinished] = useState(false);

  return (
    <>
      {Big(token.countdown || 0).gt(0) && !countdownFinished ? (
        <Countdown
          token={token}
          onFinish={() => {
            setCountdownFinished(true);
            setMemesListCountdown?.({
              [token.id]: 0
            });
          }}
        />
      ) : (
        <div className={styles.TokenItemMarketCap}>
          MC{" "}
          {numberFormatter(token.market_cap, 2, true, {
            prefix: "$",
            isShort: true,
            isShortUppercase: true
          })}
        </div>
      )}
    </>
  );
};
