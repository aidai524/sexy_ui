import styles from "./index.module.css";
import TokenIcon from "@/app/components/avatar/token";
import VideoIcon from "@/app/components/icons/video";
import TokenTags from "@/app/components/tokenTags";
import Copyed from "@/app/components/copyed";
import { checkFileType, formatAddress } from "@/app/utils";
import { useState } from "react";
import FullPlay from "../fullPlay";

export default function Summary({ data, showAddress, from }: any) {
  const [showFullPlay, setShowFullPlay] = useState(false);
  return (
    <div className={styles.tokenSummary}>
      <div className={styles.tokenSummaryContent}>
        <TokenIcon token={data} />
        <div className={styles.tokenSummaryInfo}>
          <div className={styles.tokenSummaryTitle}>{data.tokenName}</div>
          <div className={styles.tokenSummaryDesc}>
            {checkFileType(data.tokenImg) === "video" && from !== "panel" && (
              <div
                onClick={() => {
                  setShowFullPlay(true);
                }}
                className={styles.tokenSummaryIcon}
              >
                <VideoIcon />
              </div>
            )}
            <div className={styles.tokenSummaryDescText}>
              <TokenTags token={data} />
            </div>
          </div>
        </div>
      </div>
      {showAddress && (
        <div className={styles.tokenAddressWrapper}>
          <div className={styles.tokenAddressContent}>
            <Copyed value={data.address as string}>
              <div className={styles.tokenAddress}>
                {formatAddress(data.address as string)}
              </div>
            </Copyed>
          </div>
        </div>
      )}
      {checkFileType(data.tokenImg) === "video" && (
        <FullPlay
          src={data.tokenImg as string}
          show={showFullPlay}
          onClose={() => setShowFullPlay(false)}
        />
      )}
    </div>
  );
}
