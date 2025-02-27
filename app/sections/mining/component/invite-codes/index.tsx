import Modal from "@/app/components/modal";
import styles from "./index.module.css";
import RefreshIcon from "./refresh-icon";
import Copyed from "@/app/components/copyed";
import clsx from "clsx";
import { useUserAgent } from "@/app/context/user-agent";

export default function InviteCodes({ show, onClose }: any) {
  const { isMobile } = useUserAgent();
  return (
    <Modal
      open={show}
      onClose={onClose}
      animation={isMobile ? "popup" : "modal"}
      forceNoCloseIcon={isMobile}
    >
      <div
        className={styles.Container}
        style={{
          borderRadius: isMobile ? "20px 20px 0px 0px" : 20
        }}
      >
        <div className={styles.Header}>
          <span>Invite Code (100)</span>
          <button className={clsx(styles.RefreshButton, "button")}>
            <RefreshIcon />
          </button>
        </div>
        <div className={styles.CodeList}>
          {[1, 2, 3, 4].map((item) => (
            <div className={styles.CodeItem} key={item}>
              <span>7Y01U4</span>
              <Copyed value={"7Y01U4"}></Copyed>
            </div>
          ))}
        </div>
        <button className={clsx(styles.Button, "button")}>Copy all</button>
        <div className={styles.Desc}>
          <div>How to get more code?</div>
          <div className={styles.DescTags}>
            <div className={styles.DescTag}>
              {"Like 'Genesis'"}
              <span style={{ color: "#FBCA04" }}>+5</span>
            </div>
            <div className={styles.DescTag}>
              Create a token <span style={{ color: "#FBCA04" }}>+20</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
