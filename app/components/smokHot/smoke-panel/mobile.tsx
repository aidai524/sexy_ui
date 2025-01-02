import { Modal, Popup } from "antd-mobile";
import styles from "./mobile.module.css";
import Trade from "../trade";
import type { Project } from "@/app/type";
import { motion } from "framer-motion";

interface Props {
  show: boolean;
  token: Project;
  onSuccess: () => void;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onSuccess, onHide }: Props) {

  return (
    <Modal
      visible={show}
      closeOnMaskClick
      className="no-bg trans-flip"
      onClose={() => {
        onHide && onHide();
      }}
      content={<motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: show ? 360 : 180 }}
        exit={{ rotateY: 180 }}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}>
        <div className={styles.main}>

          <Trade
            modalShow={show}
            token={token}
            onClose={() => { onHide && onHide(); }}
            onSuccess={() => {
              onSuccess && onSuccess()
            }}
          />

          <div className={styles.smokeLogo}>
            <img className={styles.smokeImg} src="/img/home/flipLogo.png" />
          </div>
        </div>
      </motion.div>}
      bodyStyle={{
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
    </Modal>
  );
}
