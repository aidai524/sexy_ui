import LimitProject from "../limitProjects";
import styles from "./index.module.css";

export default function Statistics() {
  return (
    <div className={styles.statistics}>
      <div className={styles.statisticsItem}>
        <div className={styles.statisticsTitle}>Total Mining</div>
        <div style={{ fontSize: 26 }} className={styles.value}>
          5,256
        </div>
      </div>
      <div className={styles.statisticsItem}>
        <div className={styles.statisticsTitle}>You Liked</div>
        <div
          style={{ borderBottom: "1px dashed #fff" }}
          className={styles.value}
        >
          5,256
        </div>
      </div>
      <div className={styles.statisticsItem}>
        <div className={styles.statisticsTitle}>Launching Rate</div>
        <div className={styles.value}>0.37%</div>
      </div>
      <div className={styles.statisticsItem}>
        <div className={styles.statisticsTitle}>Launched Projects</div>
        <div style={{ marginTop: 5 }}>
          <LimitProject />
        </div>
      </div>
    </div>
  );
}
