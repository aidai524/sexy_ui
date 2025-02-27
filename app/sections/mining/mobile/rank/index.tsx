import RankPanel from "../../component/rank";
import Modal from "@/app/components/modal";
import styles from "./index.module.css";

export default function Rank({
  show,
  onClose,
  info,
  infoLoading,
  userInfo
}: any) {
  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      forceNoCloseIcon={true}
    >
      <div className={styles.Container}>
        <RankPanel loading={infoLoading} info={info} userInfo={userInfo} />
      </div>
    </Modal>
  );
}
