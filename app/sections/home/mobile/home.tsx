"use client";

import Header from "./header";
import List from "./list";
import styles from "./home.module.css";
import PageHeader from "@/app/components/page-header/mobile";
import { useHomeTab } from "@/app/store/useHomeTab";
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
      <div
        className={styles.ListWrapper}
        style={{
          transform: `translateX(-${homeTabStore.homeTabIndex * innerWidth}px)`,
          height: innerHeight,
          width: innerWidth
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
