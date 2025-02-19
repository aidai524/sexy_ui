import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";
import { motion } from "framer-motion";

const TABS = [
  {
    label: "Pre-Launch",
    key: 0
  },
  {
    label: "Launches",
    key: 1
  }
];

export default function Tabs({ launchIndex, setLaunchIndex }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.launchPadTab}
      style={{
        gap: isMobile ? 20 : 146
      }}
    >
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
              style={{
                backgroundColor: isMobile ? "#fff" : "#FBCA04"
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
