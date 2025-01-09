import { useState } from "react";
import Header from "./header";
import styles from "./index.module.css";

export default function HomeMobile() {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div className={styles.Container}>
      <Header
        currentTab={currentTab}
        onChangeTab={(tab: number) => {
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
