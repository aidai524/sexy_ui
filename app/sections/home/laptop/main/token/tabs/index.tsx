import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useRef } from "react";

const TABS = [
  {
    label: "Info",
    key: "info"
  },
  {
    label: "Chart",
    key: "chart"
  },
  {
    label: "Buy/Sell",
    key: "buy/sell"
  },
  {
    label: "Txs",
    key: "txs"
  }
];

export default function Tabs({ currentTab, onChangeTab }: any) {
  const prevI = useRef<number[]>([0]);
  return (
    <div className={styles.Container}>
      {TABS.map((tab, i) => (
        <div
          key={tab.key}
          className={`${currentTab === tab.key && styles.active} ${
            styles.Tab
          } button`}
          onClick={() => {
            onChangeTab(tab.key);
            prevI.current.push(i);
            if (prevI.current.length > 2) prevI.current.shift();
          }}
        >
          <span>{tab.label}</span>
          {currentTab === tab.key && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {
                  x: i < prevI.current[0] ? "50%" : "-50%"
                },
                show: {
                  x: "0%",
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
              className={styles.Line}
            />
          )}
        </div>
      ))}
    </div>
  );
}
