import styles from "./detail.module.css";
import type { Project } from "@/app/type";
import { ProgressBar } from "antd-mobile";
import Big from "big.js";
import Empty from "@/app/components/empty";
import HeartIcon from "@/app/components/icons/heart";
import ClockIcon from "@/app/components/icons/clock";
import { useCountDown } from "ahooks";
import { numberFormatter } from "@/app/utils/common";
import Summary from "./summary";

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

export default function InfoPart({ data, showAddress = true }: Props) {
  const [timeLeft, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: data?.timeLeft || 0,
    interval: 1000
  });

  if (!data) {
    return <Empty text="No info" />;
  }

  return (
    <div>
      <Summary data={data} showAddress={showAddress} />
      {data.status === 0 && (
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
                        new Big(data.prePaidAmount || 0)
                          .div(10 ** 9)
                          .toString(),
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
