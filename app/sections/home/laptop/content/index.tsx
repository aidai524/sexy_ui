import { useState } from "react";
import Header from "./header";
import styles from "./index.module.css";

export default function Content({ userInfo }: any) {
  const [tab, setTab] = useState(0);
  return (
    <div className={styles.Container}>
      <Header tab={tab} setTab={setTab} userInfo={userInfo} />
    </div>
  );
}
