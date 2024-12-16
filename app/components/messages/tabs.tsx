import { motion } from "framer-motion";
import Badge from "../badge";
import styles from "./tabs.module.css";
import { useRef } from "react";

const TABS = [
  {
    label: "Inform",
    key: "inform"
  },
  {
    label: "News Feed",
    key: "news"
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
          <Badge number={1}>
            <span>{tab.label}</span>
          </Badge>
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
