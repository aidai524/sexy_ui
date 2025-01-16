import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import LimitProject from "../../component/limitProjects";
import { useUserAgent } from "@/app/context/user-agent";

export default function Others({ info }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.Container}
      style={{
        display: isMobile ? "block" : "flex"
      }}
    >
      <div className={isMobile ? styles.Item : styles.ItemPc}>
        <div className={styles.Label}>My volume</div>
        <div
          className={styles.Value}
          style={{
            textAlign: isMobile ? "right" : "center"
          }}
        >
          {info?.my_volume
            ? numberFormatter(info?.my_volume, 2, true, {
                isShort: true,
                round: 0,
                prefix: "$"
              })
            : "$-"}
        </div>
      </div>
      <div className={isMobile ? styles.Item : styles.ItemPc}>
        <div className={styles.Label}>Launch Rate</div>
        <div
          className={styles.Value}
          style={{
            textAlign: isMobile ? "right" : "center"
          }}
        >
          {info?.launching_rate ? (info.launching_rate * 100).toFixed(2) : "-"}%
        </div>
      </div>
      <div className={isMobile ? styles.Item : styles.ItemPc}>
        <div className={styles.Label}>Launched Projects</div>
        <div
          className={styles.Value}
          style={{
            textAlign: isMobile ? "right" : "center"
          }}
        >
          <LimitProject list={info?.launched_project} />
        </div>
      </div>
    </div>
  );
}
