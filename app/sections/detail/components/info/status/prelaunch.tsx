import Big from "big.js";
import HeartIcon from "@/app/components/icons/heart";
import ClockIcon from "@/app/components/icons/clock";
import { ProgressBar } from "antd-mobile";
import { numberFormatter } from "@/app/utils/common";
import { useCountDown } from "ahooks";
import styles from "./index.module.css";
export default function PrelaunchStatus({ data, showAddress }: any) {
  const [timeLeft, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: data?.timeLeft || 0,
    interval: 1000
  });
  return (
    <div className={styles.panelEmpty}>
      <div className={styles.singleProgress}>
        <div className={styles.progressTitleWrapper}>
          <div className={styles.progressTitle}>
            <ClockIcon />
            {showAddress ? (
              <div className={styles.progressTime}>
                {hours} : {minutes} : {seconds}
              </div>
            ) : (
              <div className={styles.progressTime}>3 : 00 : 00</div>
            )}
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
                ? numberFormatter(
                    new Big(data.prePaidAmount || 0).div(10 ** 9).toString(),
                    4,
                    true
                  )
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
  );
}
