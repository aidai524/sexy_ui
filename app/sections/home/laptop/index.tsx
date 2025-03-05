import Header from "./header";
import List from "./list";
import { useHomeTab } from "@/app/store/useHomeTab";
import { LaunchType } from "@/app/store/use-projects-new";
import styles from "./index.module.css";
import { useUser } from '@/app/store/useUser';
import InviteCodeView from '@/app/sections/invite-code';
import React from 'react';

export default function Laptop() {
  const homeTabStore: any = useHomeTab();
  const { userInfo } = useUser();

  return !!userInfo?.allow_login ? (
    <div className={styles.Container}>
      <Header />

      <div className={styles.Content}>
        {Object.keys(LaunchType).map((item, i) => (
          <List
            type={item}
            key={i}
            tabIndex={i}
            isCurrentTab={homeTabStore.homeTabIndex === i}
          />
        ))}
      </div>
    </div>
  ) : (
    <div
      style={{
        position: "fixed",
        zIndex: 800,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0d0d0d"
      }}
    >
      <InviteCodeView />
    </div>
  );
}
