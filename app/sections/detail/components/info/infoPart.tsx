import styles from "./detail.module.css";
import type { Project } from "@/app/type";
import { formatAddress, formatDateEn, simplifyNum, timeAgo } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useAccount } from "@/app/hooks/useAccount";
import useMc from "@/app/hooks/useMc";
import LaunchTag from "@/app/components/tag/status";
import Copyed from "@/app/components/copyed";
import Holder from "@/app/components/holder";
import { ProgressBar } from "antd-mobile";
import Big from "big.js";
import TokenTags from "@/app/components/tokenTags";
import { getVideoExt, imgReg, videoReg } from "@/app/components/upload";
import VideoPlayer from "@/app/components/video";
import Empty from "@/app/components/empty";
import { useTrendsStore } from "@/app/store/useTrends";

interface Props {
  data: Project;
  specialTime?: string;
  showLikes?: boolean;
  showProgress?: boolean;
  showHolders?: boolean;
  showAddress?: boolean;
  showMedia?: boolean;
  theme?: string;
  mc?: string | number;
  withoutFlip?: boolean;
}

export default function InfoPart({
  data,
  specialTime,
  showLikes = true,
  theme = "dark",
  showProgress = true,
  showHolders = true,
  showAddress = true,
  showMedia = true,
  mc,
  withoutFlip
}: Props) {
  const { address } = useAccount();
  const router = useRouter();
  const { top1 } = useTrendsStore();
  const { mc: pumpMc } = useMc({
    tokenAddress: data?.address,
    disable: (data?.DApp === "sexy" && data?.status === 1) || data?.status! < 1
  });
  const userName = useMemo(() => {
    if (data?.creater) {
      if (data.creater.name) {
        return data.creater.name;
      }

      if (data.creater.address) {
        return formatAddress(data.creater.address);
      }
    }

    if (data?.account) {
      return formatAddress(data.account);
    }
    return "-";
  }, [data]);
  const { isMobile } = useUserAgent();

  if (!data) {
    return <Empty text="No info" />;
  }

  return (
    <div>
      <div className={styles.detailAvatar}>
        {showMedia && (
          <div className={styles.tokenImgWrapper}>
            {videoReg.test(data.tokenImg || "") ? (
              <VideoPlayer
                key={data.tokenImg}
                src={data.tokenImg}
                playManually={true}
                type={getVideoExt(data.tokenImg)}
                className={styles.tokenImg}
              />
            ) : (
              <img
                key={data.tokenImg}
                className={styles.tokenImg}
                src={data.tokenImg || "/img/token-placeholder.png"}
              />
            )}
          </div>
        )}

        <div
          style={{
            width: showMedia ? "calc(100% - 100px)" : "100%"
          }}
        >
          <div className={styles.nameWrapper}>
            <div className={styles.name}>{data.tokenName}</div>
            <div className={styles.tickerWrapper}>
              <div className={styles.ticker}>Ticker:</div>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span className={styles.des}>{data.ticker}</span>
                <TokenTags token={data} />
              </div>
            </div>
          </div>

          <div className={styles.author}>
            <div className={styles.authorTitle}>Created by:</div>
            <div
              onClick={() => {
                if (address !== data.account)
                  router.push(
                    "/profile/user?account=" + data.account + "&from=detail"
                  );
              }}
              className={[
                styles.authorDesc,
                styles.authorDescEs,
                "text-overflow",
                "button"
              ].join(" ")}
            >
              {userName}
              {address === data.account && (
                <span style={{ color: "#FBCA04" }}>(Self)</span>
              )}
            </div>
          </div>
          {data.creater && data.creater.education && (
            <div className={styles.author}>
              <div className={styles.authorTitle}>Education:</div>
              <div
                className={[styles.authorDesc, styles.authorDescEs].join(" ")}
              >
                {data.creater && data.creater.education}
              </div>
            </div>
          )}
          <div className={styles.author}>
            <div className={styles.authorTitle}>Create time:</div>
            <div className={styles.authorDesc}>
              {specialTime
                ? specialTime
                : timeAgo(data.DApp === "pump" ? data.time : data.createdAt)}
            </div>
          </div>
          {data.DApp === "pump" && (
            <div className={styles.author}>
              <div className={styles.authorTitle}>{"Import time"}:</div>
              <div className={styles.authorDesc}>
                {specialTime ? specialTime : timeAgo(data.createdAt)}
              </div>
            </div>
          )}
          <div className={styles.author}>
            <div className={styles.authorTitle}>Market cap:</div>
            {data.DApp === "sexy" && data.status === 1 && (
              <div className={styles.authorDesc} key={data.address}>
                {mc === 0 || mc === "0" || mc === "-" ? (
                  <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                ) : (
                  <div style={{ color: "#6fff00" }}>
                    ${simplifyNum(mc as number, 2)}
                  </div>
                )}
              </div>
            )}

            {((data.status === 1 && data.DApp === "pump") ||
              data.status! > 1) && (
              <div
                className={styles.authorDesc}
                key={data.address}
                style={{ color: "#6fff00" }}
              >
                {pumpMc === 0 ? (
                  <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                ) : (
                  <div style={{ color: "#6fff00" }}>
                    ${simplifyNum(pumpMc as number, 2)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {!!data.about && (
        <div className={styles.aboutUs}>
          <div className={styles.abountDetail}>{data.about}</div>
        </div>
      )}

      {data.status === 0 && (
        <div className={styles.panel}>
          <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>
                Pre-launch progress (Likes)
              </div>
              <div className={styles.progressPercent}>{data.like || 0}/100</div>
            </div>

            <ProgressBar
              percent={data.like || 0}
              style={{
                "--track-width": "14px",
                "--fill-color": "#FFA8E8",
                "--track-color": "#29242B"
              }}
            />

            <div className={styles.progressDesc}>
              It takes 100 likes to get into launching phase.
            </div>
          </div>

          <div className={styles.singleProgress} style={{ marginTop: 15 }}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>
                {data.prePaid || 0} Flipped
              </div>
              <div className={styles.progressPercent}>
                {data.prePaidAmount && data.prePaid 
                  ? new Big(data.prePaidAmount || 0)
                      .div(10 ** 9)
                      .toFixed(4)
                      .toString()
                  : 0} 
                 SOL
              </div>
            </div>

            <div className={styles.progressDesc} style={{ color: "#D9D9D9" }}>
              {
                "‘Flip’ means ‘pre-buy’, users will auto-buy in at the average price when this meme launching."
              }
            </div>
          </div>
        </div>
      )}

      {data.status !== 0 && (
        <div className={styles.panel}>
          <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>Bonding curve progress</div>
              <div className={styles.progressPercent}>
                {data.bondingProgress}%
              </div>
            </div>

            <ProgressBar
              percent={data.bondingProgress}
              style={{
                "--track-width": "14px",
                "--fill-color": "#FBCA04",
                "--track-color": "#29242B"
              }}
            />

            <div className={styles.progressDesc}>
              Graduate this coin to Meteora at $40,560 market cap. There will be
              40.56 SOL in the bonding curve.
            </div>
          </div>

          <div className={styles.singleProgress} style={{ marginTop: 15 }}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>
                King of the hill progress
              </div>
              <div className={styles.progressPercent}>
                {data.kingProgress && top1?.address === data.address
                  ? 100
                  : data.kingProgress}
                %
              </div>
            </div>

            <ProgressBar
              percent={
                data.kingProgress && top1?.address === data.address
                  ? 100
                  : data.kingProgress
              }
              style={{
                "--track-width": "14px",
                "--fill-color": "#BF66FF",
                "--track-color": "#29242B"
              }}
            />

            {data.lastKingTime !== 0 && (
              <div className={styles.progressDesc} style={{ color: "#BF66FF" }}>
                Crowned king of the hill on{" "}
                {data.lastKingTime
                  ? formatDateEn(data.lastKingTime, "MMM D, YYYY HH:mm:ss")
                  : "-"}
              </div>
            )}
          </div>
        </div>
      )}

      {showAddress && (
        <div className={styles.panel}>
          <div className={styles.tokenAddressWrapper}>
            <div className={styles.tokenAddressTitle}>Contract address:</div>
            <div className={styles.tokenAddressContent}>
              <div className={styles.tokenAddress}>
                {formatAddress(data.address as string)}
              </div>
              <Copyed value={data.address as string} />
            </div>
          </div>
        </div>
      )}

      {(data.x || data.tg || data.discord || data.website) && (
        <div className={styles.panel}>
          <div
            className={styles.communityIcons}
            style={{
              gap: isMobile ? "15vw" : "60px"
            }}
          >
            {data.website && (
              <a className={styles.link} target="_blank" href={data.website}>
                <img src="/img/community/website.svg" />
              </a>
            )}

            {data.x && (
              <a className={styles.link} target="_blank" href={data.x}>
                <img src="/img/community/x.svg" />
              </a>
            )}

            {data.tg && (
              <a className={styles.link} target="_blank" href={data.tg}>
                <img src="/img/community/telegram.svg" />
              </a>
            )}

            {data.discord && (
              <a className={styles.link} target="_blank" href={data.discord}>
                <img src="/img/community/discard.svg" />
              </a>
            )}
          </div>
        </div>
      )}

      {showHolders && (
        <div className={styles.panel}>
          <Holder address={data.address} />
        </div>
      )}
    </div>
  );
}
