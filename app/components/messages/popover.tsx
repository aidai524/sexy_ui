import { motion } from "framer-motion";
import Header from "./header";
import Item from "./item";
import styles from "./popover.module.css";
import { useState } from "react";

export default function Messages({ style, onClose, onShowMore }: any) {
  const [currentTab, setCurrentTab] = useState("inform");
  return (
    <motion.div
      initial={{
        y: 20
      }}
      animate={{
        y: 0
      }}
      className={styles.Container}
      style={style}
    >
      <Header
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        onClose={onClose}
      />
      <div className={styles.Content}>
        <Item />
        <Item />
        <Item />
        <Item />
        {/* <div className={styles.EmptyText}>No information</div> */}
      </div>
      <div className={styles.Bottom}>
        <span className="button">All read</span>
        <div className={`${styles.ViewAll} button`} onClick={onShowMore}>
          <span>View all</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
          >
            <path
              d="M1.2778 0.864781L5.52044 5.10742L1.2778 9.35006"
              stroke="#FF2681"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
