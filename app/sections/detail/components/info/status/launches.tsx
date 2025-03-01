import { simplifyNum } from "@/app/utils";
import styles from "./index.module.css";
import { ProgressBar } from "antd-mobile";
export default function LaunchesStatus({ data }: any) {


  console.log('data', data)
  
  return (
    <div className={styles.panel}>
      {
        data.status === 1 && (
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
        )
      }

      <div className={styles.priceContent} style={{ marginTop: data.status === 1 ? 15 : 0 }}>
        <div className={styles.priceNums}>
          <div className={styles.priceAmount}>${data.mc && simplifyNum(Number(data.mc), 2)}</div>
          {
            Number(data.marketCap24hUsd) > 0 && <div className={styles.priceUp}>+${simplifyNum(data.marketCap24hUsd, 2)}</div>
          }
          {
            Number(data.marketCap24hUsd) < 0 && <div className={styles.priceDown}>-${simplifyNum(data.marketCap24hUsd, 2)}</div>
          }
        </div>
        <div className={styles.priceUnit}>${simplifyNum(data.price, 2)}</div>
      </div>
    </div>
  );
}
