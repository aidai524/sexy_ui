import { simplifyNum } from "@/app/utils";
import styles from "./index.module.css";
import { ProgressBar } from "antd-mobile";
import ZeroFormat from "@/app/components/zeroFomat";
import Big from "big.js";
import { numberFormatter } from "@/app/utils/common";
export default function LaunchesStatus({ data }: any) {
  return (
    <div className={styles.panel}>
      {data.status === 1 && (
        <div className={styles.singleProgress}>
          <div className={styles.progressTitleWrapper}>
            <div className={styles.progressPercent}>
              {data.bondingProgress}%
            </div>
            <div className={styles.progressTitle}>
              {numberFormatter(new Big(data.solReserve).div(10 ** 9).toString(), 2, true)} SOL / <span style={{ color: "#9290B1" }}>40.56 SOL</span>
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
      )}

      <div
        className={styles.priceContent}
        style={{ marginTop: data.status === 1 ? 15 : 0 }}
      >
        <div className={styles.priceNums}>
          <div className={styles.priceAmount}>
            ${data.mc && simplifyNum(Number(data.mc), 2)}
          </div>
          {Number(data.marketCap24hUsd) > 0 && (
            <div className={styles.priceUp}>
              +${simplifyNum(data.marketCap24hUsd, 2)}
            </div>
          )}
          {Number(data.marketCap24hUsd) < 0 && (
            <div className={styles.priceDown}>
              -${simplifyNum(data.marketCap24hUsd, 2)}
            </div>
          )}
        </div>
        <div className={styles.priceUnit}>$<ZeroFormat value={data.price} /> </div>
      </div>
    </div>
  );
}
