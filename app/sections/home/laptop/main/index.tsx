import { useState } from "react";
import Header from "./header";
import Content from "./content";
import styles from "./index.module.css";

export default function Main({ userInfo }: any) {
  const [tab, setTab] = useState(0);
  return (
    <div className={styles.Container}>
      <Header tab={tab} setTab={setTab} userInfo={userInfo} />
      <Content />
    </div>
  );
}
