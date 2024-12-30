import styles from "./laptop.module.css";
import { motion } from "framer-motion";
import ActionList from "../actionList";
import { useEffect } from "react";
export default function Laptop({
  modalShow,
  setModalShow,
  token,
  prepaidWithdrawDelayTime
}: any) {
  useEffect(() => {
    const close = () => {
      setModalShow(false);
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    modalShow && (
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={styles.Container}
        onClick={(ev) => {
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
        }}
      >
        <ActionList
          token={token}
          prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
        />
      </motion.div>
    )
  );
}
