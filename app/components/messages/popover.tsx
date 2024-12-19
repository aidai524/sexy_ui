import { motion } from "framer-motion";
import Header from "./header";
import Item from "./item";
import styles from "./popover.module.css";
import { useMemo, useState } from "react";

export default function Messages({
  style,
  list,
  feeds,
  onClose,
  onShowMore,
  onRead,
  num
}: any) {
  const [currentTab, setCurrentTab] = useState("inform");
  const data = useMemo(
    () => (currentTab === "inform" ? list : feeds),
    [currentTab]
  );
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
        num={num}
      />
      <div className={styles.Content}>
        {data.map((item: any) => (
          <Item key={item.msg_id} item={item} />
        ))}
        {data.length === 0 && (
          <div className={styles.EmptyText}>No information</div>
        )}
      </div>
      <div className={styles.Bottom}>
        <div />
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
