import ModalClose from "@/app/components/icons/modal-close";
import Follower from "../../../follower";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useMemo } from "react";
import { formatLongText } from '@/app/utils/common';

export default function Followers({
  userInfo,
  address,
  action,
  onClose,
  onSuccess
}: any) {
  const name = useMemo(() => {
    if (userInfo?.name) return formatLongText(userInfo.name, 10, 4);
    return address.slice(0, 4) + "..." + address.slice(-4);
  }, [userInfo, address]);
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      className={styles.Container}
    >
      <div className={styles.Title}>
        <span>{name}</span>
        <button className="button" onClick={onClose}>
          <ModalClose size={34} />
        </button>
      </div>
      <div className={styles.Content}>
        <Follower address={address} action={action} onSuccess={onSuccess} />
      </div>
    </motion.div>
  );
}
