import LaunchTag from "../tag/status";
import styles from "./avatar-box.module.css";



export default function AvatarBox({ data, showLaunchType }: any) {
  return (
    <div className={styles.avatarBox}>
      <div className={styles.tokenImgBox} >
        <img
          style={{ opacity: data.tokenIcon ? 0.3 : 1 }}
          className={styles.tokenImg}
          src={data.tokenIcon || "/img/token-icon-placeholder.svg"}
        />
      </div>
      <div className={styles.InfoWrapper}>
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
