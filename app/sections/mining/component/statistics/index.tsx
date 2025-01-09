import LimitProject from "../limitProjects";
import styles from "./index.module.css";
import { addThousandSeparator, numberFormatter } from "@/app/utils/common";
import { useUserAgent } from "@/app/context/user-agent";

export default function Statistics({ itemStyle, style, info }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div className={styles.statistics} style={style}>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>My likes</div>
        <div style={{ fontSize: isMobile ? 18 : 22 }} className={styles.value}>
          {info?.liked ? addThousandSeparator(info?.liked) : "0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>My volume</div>
        <div
          style={{
            fontSize: isMobile ? 18 : 22
          }}
          className={styles.value}
        >
          {info?.volume
            ? numberFormatter(info?.liked, 2, true, {
                isShort: true,
                round: 0,
                prefix: "$"
              })
            : "$0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>My refferrals</div>
        <div style={{ fontSize: isMobile ? 18 : 22 }} className={styles.value}>
          {info?.refferrals ? addThousandSeparator(info?.liked) : "0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>My kickback</div>
        <div
          style={{
            fontSize: isMobile ? 18 : 22
          }}
          className={styles.value}
        >
          {info?.kickback ? addThousandSeparator(info?.liked) : "0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>Launching Rate</div>
        <div
          className={styles.value}
          style={{
            fontSize: isMobile ? 18 : 22
          }}
        >
          {info?.launching_rate ? (info.launching_rate * 100).toFixed(2) : "0"}%
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>Launched Projects</div>
        <div style={{ marginTop: 5 }}>
          <LimitProject list={info?.launched_project} />
        </div>
      </div>
    </div>
  );
}
