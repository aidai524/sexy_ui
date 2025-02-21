"use client";

import List from "./list";
import styles from "./home.module.css";
import PageHeader from "@/app/components/page-header/mobile";
import Tabs from "./tabs";
import { useHomeTab } from "@/app/store/useHomeTab";
import { LaunchType } from "@/app/store/use-projects-new";
import { useUserAgent } from "@/app/context/user-agent";

export default function HomeMobile() {
  const homeTabStore: any = useHomeTab();
  const { innerHeight, innerWidth } = useUserAgent();

  return (
    <div
      className={styles.Container}
      style={{ height: innerHeight, width: innerWidth }}
    >
      <PageHeader from="home" />
      <Tabs />
      <div
        className={styles.ListWrapper}
        style={{
          transform: `translateX(-${homeTabStore.homeTabIndex * innerWidth}px)`,
          height: innerHeight,
          width: innerWidth
        }}
      >
        {Object.keys(LaunchType).map((item, i) => (
          <List
            type={item}
            key={i}
            onChangeTab={(tab: number) => {
              let _tab = tab;
              if (tab < 0) _tab = 0;
              const len = Object.keys(LaunchType).length;
              if (tab > len - 1) _tab = len - 1;
              homeTabStore.set({ homeTabIndex: _tab });
            }}
            tabIndex={i}
            isCurrentTab={homeTabStore.homeTabIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
