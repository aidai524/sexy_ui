import styles from "./index.module.css";
import { ProgressBar } from "antd-mobile";
export default function LaunchesStatus({ data }: any) {
  return (
    <div className={styles.panel}>
      <div className={styles.singleProgress}>
        <div className={styles.progressTitleWrapper}>
          <div className={styles.progressPercent}>{data.bondingProgress}%</div>
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
  );
}
