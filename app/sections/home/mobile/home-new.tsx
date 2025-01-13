"use client";

import { useState } from "react";
import Header from "./header";
import List from "./list";
import styles from "./home-new.module.css";
import { useUserAgent } from "@/app/context/user-agent";

export default function HomeMobile() {
  const [currentTab, setCurrentTab] = useState(0);
  const { innerHeight } = useUserAgent();

  return (
    <>
      <div className={styles.Container} style={{ height: innerHeight }}>
        <Header
          currentTab={currentTab}
          onChangeTab={(tab: number) => {
            setCurrentTab(tab);
          }}
        />
        <div
          className={styles.ListWrapper}
          style={{
            transform: `translateX(${-currentTab * 100}vw)`,
            height: innerHeight
          }}
        >
          <List
            type="preLaunch"
            onChangeTab={setCurrentTab}
            isCurrentTab={currentTab === 0}
          />
          <List
            type="launching"
            onChangeTab={setCurrentTab}
            isCurrentTab={currentTab === 1}
          />
        </div>
      </div>
    </>
  );
}
