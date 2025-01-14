"use client";

import Header from "./header";
import List from "./list";
import styles from "./home-new.module.css";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useUserAgent } from "@/app/context/user-agent";

export default function HomeMobile() {
  const homeTabStore: any = useHomeTab();
  const { innerHeight } = useUserAgent();

  return (
    <div className={styles.Container} style={{ height: innerHeight }}>
      <Header
        currentTab={homeTabStore.homeTabIndex}
        onChangeTab={(tab: number) => {
          homeTabStore.set({ homeTabIndex: tab });
        }}
      />
      <div
        className={styles.ListWrapper}
        style={{
          transform: `translateX(-${homeTabStore.homeTabIndex * 100}vw)`,
          height: innerHeight
        }}
      >
        <List
          type="preLaunch"
          onChangeTab={(tab: number) => {
            homeTabStore.set({ homeTabIndex: tab });
          }}
          isCurrentTab={homeTabStore.homeTabIndex === 0}
        />
        <List
          type="launching"
          onChangeTab={(tab: number) => {
            homeTabStore.set({ homeTabIndex: tab });
          }}
          isCurrentTab={homeTabStore.homeTabIndex === 1}
        />
      </div>
    </div>
  );
}
