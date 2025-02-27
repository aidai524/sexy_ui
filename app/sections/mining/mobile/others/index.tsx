import styles from "./index.module.css";
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
