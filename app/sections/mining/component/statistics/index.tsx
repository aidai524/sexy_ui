import LimitProject from "../limitProjects";
import styles from "./index.module.css";
import { addThousandSeparator } from "@/app/utils/common";

export default function Statistics({ itemStyle, style, info }: any) {
  return (
    <div className={styles.statistics} style={style}>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>Total Mining</div>
        <div style={{ fontSize: 26 }} className={styles.value}>
          {info?.minted ? addThousandSeparator(info?.minted) : "0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>You Liked</div>
        <div
          style={{ borderBottom: "1px dashed #fff" }}
          className={styles.value}
        >
          {info?.liked ? addThousandSeparator(info?.liked) : "0"}
        </div>
      </div>
      <div className={styles.statisticsItem} style={itemStyle}>
        <div className={styles.statisticsTitle}>Launching Rate</div>
        <div className={styles.value}>{info?.launching_rate || "0"}%</div>
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
