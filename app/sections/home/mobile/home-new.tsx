"use client";

import { useState } from "react";
import Header from "./header";
import List from "./list";
import styles from "./home-new.module.css";

export default function HomeMobile() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <div className={styles.Container}>
        <Header
          currentTab={currentTab}
          onChangeTab={(tab: number) => {
            setCurrentTab(tab);
          }}
        />
        <div
          className={styles.ListWrapper}
          style={{
            transform: `translateX(${-currentTab * 100}vw)`
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
