import { defaultAvatar } from "@/app/utils/config";
import styles from "./avatar-box.module.css";

function LaunchTag({ type }: { type: number }) {
  if (type === 0) {
    return (
      <div className={styles.launchTag + " " + styles.launch1}>Pre-Launch</div>
    );
  }

  if (type === 1) {
    return (
      <div className={styles.launchTag + " " + styles.launch2}>Launching</div>
    );
  }
}

export default function AvatarBox({ data, showLaunchType }: any) {
  return (
    <div className={styles.avatarBox}>
      <div className={styles.tokenImgBox}>
        <img className={styles.tokenImg} src={data.tokenIcon || "/img/token-placeholder.png"} />
      </div>
      <div>
        <div className={styles.tokenName}>{data.tokenName}</div>
        <div className={styles.tickerContent1}>
          {data.ticker && (
            <div className={styles.ticker}>Ticker: {data.ticker}</div>
          )}
          {showLaunchType && <LaunchTag type={data.status as number} />}
        </div>
      </div>
    </div>
  );
}
