import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import tabs from "./config";
import { useHomeTab } from "@/app/store/useHomeTab";

export default function Tabs() {
  const { isMobile } = useUserAgent();
  const homeTabStore: any = useHomeTab();
  return (
    <div
      className={styles.launchPadTab}
      style={{
        gap: isMobile ? 20 : 146
      }}
    >
      {tabs.map((tab: any, i: number) => (
        <div
          key={tab.key}
          onClick={() => {
            homeTabStore.set({
              homeTabIndex: i
            });
          }}
          className={[
            styles.launchPadTabTitle,
            homeTabStore.homeTabIndex === i
              ? styles.launchPadTabTitleActive
              : ""
          ].join(" ")}
        >
          <span>{tab.label}</span>
          {homeTabStore.homeTabIndex === i && (
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
