"use client";

import styles from "./layout.module.css";
import useNotice from "../../../hooks/use-notice";
import Tabs from "./tabs";

export default function Component({ children }: any) {
  useNotice();

  return (
    <div className={styles.Main} id="main-content">
      {/* <Button onClick={() => {
        trade()
      }}>juipter</Button> */}
      {children}
      {/* <Refer userInfo={userInfo} isMobile /> */}
      <Tabs />
      {/* {isRefer && <ReferContentCard />} */}
    </div>
  );
}
