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
import Empty from "@/app/components/empty";
import { useTrendsStore } from "@/app/store/useTrends";
import TokenIcon from "@/app/components/avatar/token";
import VideoIcon from "@/app/components/icons/video";
import HeartIcon from "@/app/components/icons/heart";
import ClockIcon from "@/app/components/icons/clock";
import { useCountDown } from "ahooks";

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

  const [timeLeft, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: data.timeLeft
  });

  const { isMobile } = useUserAgent();

  if (!data) {
    return <Empty text="No info" />;
  }

  return (
    <div>
      <div className={styles.tokenSummary}>
        <div className={styles.tokenSummaryContent}>
          <TokenIcon token={data} />
          <div className={styles.tokenSummaryInfo}>
            <div className={styles.tokenSummaryTitle}>{data.tokenName}</div>
            <div className={styles.tokenSummaryDesc}>
              <div className={styles.tokenSummaryIcon}>
                <VideoIcon />
              </div>
              <div className={styles.tokenSummaryDescText}>
                <TokenTags token={data} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tokenAddressWrapper}>
          <div className={styles.tokenAddressContent}>
            <div className={styles.tokenAddress}>
              {formatAddress(data.address as string)}
            </div>
            <Copyed value={data.address as string} />
          </div>
        </div>
      </div>

      {data.status === 0 && (
        <div className={styles.panel}>
          <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>
                <ClockIcon />
                <div className={styles.progressTime}>
                  {hours} : {minutes} : {seconds}
                </div>
              </div>
              <div className={styles.progressAmount}>
                <div>{data.like || 0}/100 likes </div>
                <HeartIcon />
              </div>
            </div>
            <ProgressBar
              percent={data.like || 0}
              style={{
                "--track-width": "6px",
                "--fill-color": "#FF2681",
                "--track-color": "#29242B"
              }}
            />
          </div>

          <div
            className={styles.singleProgress}
            style={{ marginTop: 15, paddingRight: 30 }}
          >
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressPercent}>
                <div className={styles.progressTitleText}>Flipped (SOL)</div>
                <div
                  className={styles.progressTitleValue}
                  style={{ color: "#FBCA04" }}
                >
                  {data.prePaidAmount && data.prePaid
                    ? new Big(data.prePaidAmount || 0)
                        .div(10 ** 9)
                        .toFixed(4)
                        .toString()
                    : 0}
                </div>
              </div>

              <div className={styles.progressPercent}>
                <div className={styles.progressTitleText}>Flipped Account</div>
                <div
                  className={styles.progressTitleValue}
                  style={{ color: "#fff" }}
                >
                  {data.prePaid || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.status !== 0 && (
        <div className={styles.panel}>
          <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressPercent}>
                {data.bondingProgress}%
              </div>
              <div className={styles.progressTitle}>
                45.5 / <span style={{ color: "#9290B1" }}>535.6 SOL</span>
              </div>
            </div>

            <ProgressBar
              percent={data.bondingProgress}
              style={{
                "--track-width": "6px",
                "--fill-color": "#C9FF5D",
                "--track-color": "#3C3C3C80"
              }}
            />
          </div>

          <div className={styles.priceContent} style={{ marginTop: 15 }}>
            <div className={styles.priceNums}>
              <div className={styles.priceAmount}>$17.2K</div>
              <div className={styles.priceUp}>+1.1K</div>
            </div>
            <div className={styles.priceUnit}>$0.00356</div>
          </div>
        </div>
      )}
    </div>
  );
}
