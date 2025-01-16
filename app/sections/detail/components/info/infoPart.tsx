
import styles from "./detail.module.css";
import type { Project } from "@/app/type";
import { formatAddress, simplifyNum, timeAgo } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useAccount } from "@/app/hooks/useAccount";
import useMc from "@/app/hooks/useMc";
import LaunchTag from "@/app/components/tag/status";
import Copyed from "@/app/components/copyed";
import Holder from "@/app/components/holder";
import { ProgressBar } from "antd-mobile";
import Big from "big.js";

interface Props {
  data: Project;
  specialTime?: string;
  showLikes?: boolean;
  showProgress?: boolean;
  showHolders?: boolean;
  showAddress?: boolean;
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
  mc,
  withoutFlip
}: Props) {
  const { address } = useAccount();
  const router = useRouter();
  const { mc: pumpMc } = useMc({ tokenAddress: data.address, disable: data.DApp !== 'pump' })
  const userName = useMemo(() => {
    if (data.creater) {
      if (data.creater.name) {
        return data.creater.name;
      }

      if (data.creater.address) {
        return formatAddress(data.creater.address);
      }
    }

    if (data.account) {
      return formatAddress(data.account);
    }
    return "-";
  }, [data]);
  const { isMobile } = useUserAgent();

  if (!data) {
    return;
  }

  return (
    <div>
      <div className={styles.detailAvatar}>
        <div className={styles.tokenImgWrapper}>
          <img className={styles.tokenImg} src={data.tokenImg || '/img/token-placeholder.png'} />
        </div>

        <div className={styles.detailInfo}>
          <div className={styles.nameWrapper}>
            <div className={styles.name}>{data.tokenName}</div>
            <div className={styles.tickerWrapper}>
              <div className={styles.ticker}>Ticker:<span className={styles.des}>{data.ticker}</span></div>
              <LaunchTag type={data.status as number} />
            </div>
          </div>

          <div className={styles.author}>
            <div className={styles.authorTitle}>Created by:</div>
            <div
              onClick={() => {
                if (address !== data.account)
                  router.push("/profile/user?account=" + data.account);
              }}
              className={[
                styles.authorDesc,
                styles.authorDescEs,
                "button"
              ].join(" ")}
            >
              {userName}
              {address === data.account && "(Self)"}
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
            <div className={styles.authorTitle}>
              Create time:
            </div>
            <div className={styles.authorDesc}>
              {specialTime ? specialTime : timeAgo(data.DApp === "pump" ? data.createdAt : data.time)}
            </div>
          </div>
          {
            data.DApp === "pump" && <div className={styles.author}>
              <div className={styles.authorTitle}>
                {"Import time"}:
              </div>
              <div className={styles.authorDesc}>
                {specialTime ? specialTime : timeAgo(data.time)}
              </div>
            </div>
          }
          <div className={styles.author}>
            <div className={styles.authorTitle}>Market cap:</div>
            {
              data.DApp === 'sexy' && <div className={styles.authorDesc} >
                {mc === 0 || mc === "0" || mc === '-'
                  ? <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                  : <div style={{ color: "#6fff00" }} >${simplifyNum(mc as number, 2)}</div>}
              </div>
            }

            {
              data.DApp === 'pump' && <div className={styles.authorDesc} style={{ color: "#6fff00" }}>
                {pumpMc === 0
                  ? <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                  : <div style={{ color: "#6fff00" }} >${simplifyNum(pumpMc as number, 2)}</div>}
              </div>
            }

          </div>
        </div>
      </div>

      {!!data.about && (
        <div className={styles.aboutUs}>
          <div className={styles.abountDetail}>{data.about}</div>
        </div>
      )}

      {
        data.status === 0 && <div className={styles.panel}>
        <div className={styles.singleProgress}>
          <div className={styles.progressTitleWrapper}>
            <div className={styles.progressTitle}>Pre-launch progress (Likes)</div>
            <div className={styles.progressPercent}>{data.like || 0}/100</div>
          </div>

          <ProgressBar percent={data.like || 0} style={{
            '--track-width': '14px',
            '--fill-color': '#FFA8E8',
            '--track-color': '#29242B'
          }} />

          <div className={styles.progressDesc}>It takes 100 likes to get into launching phase.</div>
        </div>

        <div className={styles.singleProgress} style={{ marginTop: 15 }}>
          <div className={styles.progressTitleWrapper}>
            <div className={styles.progressTitle}>{data.prePaid || 0} Flipped</div>
            <div className={styles.progressPercent}>{data.prePaidAmount ? new Big(data.prePaidAmount || 0).div(10 ** 9).toString() : 0}SOL</div>
          </div>

          <div className={styles.progressDesc} style={{ color: '#D9D9D9' }}>{"‘Flip’ means ‘pre-buy’, users will auto-buy in when this meme launched."}</div>
        </div>
      </div>
      }

      {
        data.status !== 0 && <div className={styles.panel}>
          <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>Bonding curve progress</div>
              <div className={styles.progressPercent}>{data.bondingProgress}%</div>
            </div>

            <ProgressBar percent={data.bondingProgress} style={{
              '--track-width': '14px',
              '--fill-color': '#FBCA04',
              '--track-color': '#29242B'
            }} />

            <div className={styles.progressDesc}>Graduate this coin to Orca at $40,560 market cap.
            There will be 40.56 SOL in the bonding curve.</div>
          </div>

          <div className={styles.singleProgress} style={{ marginTop: 15 }}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>King of the hill progress</div>
              <div className={styles.progressPercent}>{data.kingProgress}%</div>
            </div>

            <ProgressBar percent={data.kingProgress} style={{
              '--track-width': '14px',
              '--fill-color': '#BF66FF',
              '--track-color': '#29242B'
            }} />

            <div className={styles.progressDesc} style={{ color: '#BF66FF' }}>Crowned king of the hill on 1/6/2025, 8:50:03 PM</div>
          </div>
        </div>
      }

      {
        showAddress && <div className={styles.panel}>
          <div className={styles.tokenAddressWrapper}>
            <div className={styles.tokenAddressTitle}>Contract address:</div>
            <div className={styles.tokenAddressContent}>
              <div className={styles.tokenAddress}>{formatAddress(data.address as string)}</div>
              <Copyed value={data.address as string} />
            </div>
          </div>
        </div>
      }

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
              <a
                className={styles.link}
                target="_blank"
                href={data.discord}
              >
                <img src="/img/community/discard.svg" />
              </a>
            )}
          </div>
        </div>
      )}

      {
        showHolders && <div className={styles.panel}>
          <Holder address={data.address} />
        </div>
      }

    </div>
  );
}
