import Modal from "@/app/components/modal";
import styles from "./index.module.css";
import RefreshIcon from "./refresh-icon";
import Copyed from "@/app/components/copyed";
import clsx from "clsx";
import { useUserAgent } from "@/app/context/user-agent";
import { Skeleton } from "antd-mobile";

export default function InviteCodes({
  show,
  onClose,
  list = [],
  loading,
  onCopyAll,
  onQuery
}: any) {
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
          <span>Invite Code (10)</span>
          <button
            className={clsx(styles.RefreshButton, "button")}
            onClick={onQuery}
          >
            <RefreshIcon />
          </button>
        </div>
        <div className={styles.CodeList}>
          {loading
            ? [...new Array(10)].map((item) => (
                <Skeleton animated className={styles.CodeItem} />
              ))
            : list?.map((item: any) => (
                <div className={styles.CodeItem} key={item.code}>
                  <span>{item.code}</span>
                  <Copyed value={item.code} />
                </div>
              ))}
        </div>

        <button className={clsx(styles.Button, "button")} onClick={onCopyAll}>
          Copy all
        </button>
        {/* <div className={styles.Desc}>
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
        </div> */}
      </div>
    </Modal>
  );
}
