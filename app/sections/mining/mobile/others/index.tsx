import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import LimitProject from "../../component/limitProjects";

export default function Others({ info }: any) {
  return (
    <div className={styles.Container}>
      <div className={styles.Item}>
        <div className={styles.Label}>My volume</div>
        <div className={styles.Value}>
          {info?.my_volume
            ? numberFormatter(info?.my_volume, 2, true, {
                isShort: true,
                round: 0,
                prefix: "$"
              })
            : "$-"}
        </div>
      </div>
      <div className={styles.Item}>
        <div className={styles.Label}>Launch Rate</div>
        <div className={styles.Value}>
          {info?.launching_rate ? (info.launching_rate * 100).toFixed(2) : "-"}%
        </div>
      </div>
      <div className={styles.Item}>
        <div className={styles.Label}>Launched Projects</div>
        <div className={styles.Value}>
          <LimitProject list={info?.launched_project} />
        </div>
      </div>
    </div>
  );
}
