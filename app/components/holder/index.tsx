import { useEffect } from "react";
import Level from "../level/simple";
import styles from "./index.module.css";

export default function Holder({ from }: any) {
  useEffect(() => {}, []);

  return (
    <div
      className={`${styles.distributionArea} ${
        from === "laptop-home" ? styles.LaptopList : ""
      }`}
    >
      <div className={styles.distributionTitle}>Holder Distribution</div>
      <div className={`${styles.list} `}>
        <div className={styles.item}>
          <div className={styles.itemContent}>
            <div style={{ width: 20 }}>1.</div>
            <div className={styles.UserName}>
              <span>Bro098detum</span>
              <Level level={6} />
            </div>
          </div>

          <div className={styles.itemPercent}>89.2%</div>
        </div>
      </div>
    </div>
  );
}
