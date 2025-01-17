import styles from "./laptop.module.css";
import { motion } from "framer-motion";
import ActionList from "../actionList";
import { useEffect } from "react";
export default function Laptop(props: any) {
  const {
    modalShow,
    setModalShow,
    token,
    isOther,
    prepaidWithdrawDelayTime
  } = props;
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
          {...props}
        />
      </motion.div>
    )
  );
}
