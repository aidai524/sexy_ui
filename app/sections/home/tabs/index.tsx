import styles from "./index.module.css";
import { motion } from "framer-motion";

const TABS = [
  {
    label: "Pre-Launch",
    key: 0
  },
  {
    label: "Launching/ed",
    key: 1
  }
];

export default function Tabs({ launchIndex, setLaunchIndex }: any) {
  return (
    <div className={styles.launchPadTab}>
      {TABS.map((tab: any, i: number) => (
        <div
          key={tab.key}
          onClick={() => {
            setLaunchIndex(tab.key);
          }}
          className={[
            styles.launchPadTabTitle,
            launchIndex === tab.key ? styles.launchPadTabTitleActive : ""
          ].join(" ")}
        >
          <span>{tab.label}</span>
          {launchIndex === tab.key && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {
                  x: i === 0 ? "0%" : "-100%"
                },
                show: {
                  x: "-50%",
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
