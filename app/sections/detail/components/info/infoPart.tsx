import Thumbnail from "@/app/components/thumbnail";
import ThumbnailWithFlip from "@/app/components/thumbnail/with-flip";
import Panel from "../../../../components/panel";
import styles from "./detail.module.css";
import type { Project } from "@/app/type";
import { formatAddress, simplifyNum, timeAgo } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
  showThumbnailHead: boolean;
  showThumbnailProgress?: boolean;
  showBackIcon?: boolean;
  data: Project;
  specialTime?: string;
  showLikes?: boolean;
  showTop?: boolean;
  theme?: string;
  sepSize?: number;
  mc?: string | number;
  withoutFlip?: boolean;
}

export default function InfoPart({
  showThumbnailHead = false,
  showThumbnailProgress = false,
  showBackIcon = true,
  data,
  specialTime,
  showLikes = true,
  showTop = true,
  theme = "dark",
  sepSize = 10,
  mc,
  withoutFlip
}: Props) {
  const { address } = useAccount();
  const router = useRouter();
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
      {showTop && (
        <>
          {!isMobile || withoutFlip ? (
            <Thumbnail
              showLikes={showLikes}
              showLaunchType={false}
              autoHeight={true}
              showBackIcon={showBackIcon}
              data={data}
              showDesc={false}
              topDesc={showThumbnailHead}
              showProgress={showThumbnailProgress}
            />
          ) : (
            <>
              <ThumbnailWithFlip
                showLikes={showLikes}
                showLaunchType={false}
                style={{
                  height: 500
                }}
                autoHeight={false}
                showBackIcon={showBackIcon}
                data={data}
                showDesc={false}
                topDesc={showThumbnailHead}
                showProgress={showThumbnailProgress}
              />
              <Sep size={sepSize} />
            </>
          )}
        </>
      )}
      <>
        <Sep size={sepSize} />
        <Panel theme={theme}>
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
                onClick={() => {
                  router.push("/profile/user?account=" + data.account);
                }}
                className={[styles.authorDesc, styles.authorDescEs].join(" ")}
              >
                {data.creater && data.creater.education}
              </div>
            </div>
          )}
          <div className={styles.author}>
            <div className={styles.authorTitle}>
              {data.DApp === "pump" ? "Import time" : "Create time"}:
            </div>
            <div className={styles.authorDesc}>
              {specialTime ? specialTime : timeAgo(data.time)}
            </div>
          </div>
          <div className={styles.author}>
            <div className={styles.authorTitle}>Market cap:</div>
            <div className={styles.authorDesc} style={{ color: "#6fff00" }}>
              {mc === 0 || mc === "0" ? "-" : `$${simplifyNum(mc as number)}`}
            </div>
          </div>
        </Panel>
      </>
      <>
        <Sep size={sepSize} />
        <Panel theme={theme}>
          <div className={styles.aboutUs}>
            <div className={styles.aboutHeader}>About Us</div>
            <div className={styles.abountDetail}>{data.about}</div>
          </div>
        </Panel>
      </>

      {data.website && (
        <>
          <Sep size={sepSize} />
          <Panel theme={theme}>
            <div className={styles.aboutUs}>
              <div className={styles.aboutHeader}>Website</div>
              <div className={styles.linkDetail}>
                <a className={styles.link} target="_blank" href={data.website}>
                  {data.website}
                </a>
              </div>
            </div>
          </Panel>
        </>
      )}

      {(data.x || data.tg || data.discord) && (
        <>
          <Sep size={sepSize} />
          <Panel theme={theme}>
            <div className={styles.aboutUs}>
              <div className={styles.aboutHeader}>Community</div>
              <div
                className={styles.communityIcons}
                style={{
                  gap: isMobile ? "15vw" : "60px"
                }}
              >
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
          </Panel>
        </>
      )}
    </div>
  );
}

function Sep({ size }: any) {
  return <div style={{ height: size }} />;
}
