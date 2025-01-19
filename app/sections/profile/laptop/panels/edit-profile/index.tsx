import EditContent from "@/app/sections/profile/edit/content";
import ModalClose from "@/app/components/icons/modal-close";
import { motion } from "framer-motion";
import styles from "./index.module.css";

export default function EditProfile({ onClose, onSuccess }: any) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      className={styles.Container}
    >
      <div className={styles.Title}>
        <span> Edit Profile</span>
        <button className="button" onClick={onClose}>
          <ModalClose size={34} />
        </button>
      </div>
      <div className={styles.Content}>
        <EditContent
          actionButtonsStyle={{
            position: "inherit",
            backgroundColor: "transparent"
          }}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </div>
    </motion.div>
  );
}
