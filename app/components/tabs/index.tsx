import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useRef } from "react";

export default function Tabs({ currentTab, onChangeTab, tabs, type }: any) {
  const prevI = useRef<number[]>([0]);
  return (
    <div
      className={styles.Container}
      style={{
        justifyContent: type === "center" ? "center" : "flex-start"
      }}
    >
      {tabs.map((tab: any, i: number) => (
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
          style={{
            width: type === "center" ? 130 : "auto",
            textAlign: type === "center" ? "center" : "left"
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
