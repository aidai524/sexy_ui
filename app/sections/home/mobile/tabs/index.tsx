import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import tabs from "./config";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useMemo } from "react";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

export default function Tabs() {
  const { isMobile } = useUserAgent();
  const homeTabStore: any = useHomeTab();

  const mergedStyle: any = useMemo(
    () =>
      isMobile
        ? {
            position: "absolute",
            top: 45,
            width: "100%",
            background:
              "linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0) 81%)",
            zIndex: 5,
            gap: 20
          }
        : {
            gap: 34
          },
    [isMobile]
  );

  return (
    <div className={styles.launchPadTab} style={mergedStyle}>
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
