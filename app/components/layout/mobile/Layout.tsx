"use client";

import { Button, TabBar } from "antd-mobile";
import { useRouter, usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginModal from "@/app/components/loginModal";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import Link from "next/link";

function CustomIcon({
  url,
  link,
  showPlus = false
}: {
  url: string;
  link: string;
  showPlus?: boolean;
}) {
  const { likeTrigger } = useMessage();

  return (
    <div className={styles.tabIconWapper}>
      <Link href={link}>
        <img className={styles.tabIcon} src={url} />
        {showPlus && (
          <div
            className={styles.showPlus + " " + (likeTrigger ? styles.ani : "")}
          >
            +1
          </div>
        )}
      </Link>
    </div>
  );
}

const CreateIcon = (
  <Link href="/create">
    <div className={styles.createIcon}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 0L17.7813 10.2187L28 14L17.7813 17.7813L14 28L10.2187 17.7813L0 14L10.2187 10.2187L14 0Z"
          fill="white"
        />
      </svg>
    </div>
  </Link>
);

const tabs = [
  {
    key: "/",
    title: "CLUB",
    icon: <CustomIcon url="/img/tabs/tab1.svg" link="/" />,
    iconActive: <CustomIcon url="/img/tabs/tab1-active.svg" link="/" />
  },
  {
    key: "/trends",
    title: "TRENDS",
    icon: <CustomIcon url="/img/tabs/tab5.svg" link="/trends" />,
    iconActive: <CustomIcon url="/img/tabs/tab5-active.svg" link="/trends" />
  },
  {
    key: "/create",
    title: "CREATE",
    icon: CreateIcon,
    iconActive: <CustomIcon url="/img/tabs/tab3-active.svg" link="/create" />
  },
  {
    key: "/mining",
    title: "MINING",
    icon: (
      <CustomIcon showPlus={true} url="/img/tabs/tab2.svg" link="/mining" />
    ),
    iconActive: <CustomIcon url="/img/tabs/tab2-active.svg" link="/mining" />
  },
  {
    key: "/profile",
    title: "PROFILE",
    icon: <CustomIcon url="/img/tabs/tab4.svg" link="/profile" />,
    iconActive: <CustomIcon url="/img/tabs/tab4-active.svg" link="/profile" />
  }
];

export default function Component({
  showLoginModal,
  setShowLoginModal,
  children
}: any) {
  const pathname = usePathname();
  const { address } = useAccount();

  const showTabs = useMemo(() => {
    return tabs.find((tab) => {
      if (tab.key === "/") {
        return pathname === tab.key;
      }
      return pathname.indexOf(tab.key) === 0;
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* <Button onClick={() => {
        trade()
      }}>juipter</Button> */}
      <main className="pb-16">{children}</main>
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
        }}
      />

      {showTabs && (
        <TabBar
          className={styles.tabBar}
          activeKey={pathname}
          safeArea={true}
          onChange={(key) => {
            if (key !== "/") {
              if (!address) {
                // @ts-ignore
                window.connect();
                return;
              }
            }
            // router.push(key);
          }}
        >
          {tabs.map((item) => {
            if (item.title === "CREATE") {
              return (
                <TabBar.Item
                  key={item.key}
                  icon={item.icon}
                  className={styles.activeTab}
                  title={""}
                />
              );
            }
            return (
              <TabBar.Item
                key={item.key}
                icon={pathname === item.key ? item.iconActive : item.icon}
                className={styles.activeTab}
                title={item.title}
              />
            );
          })}
        </TabBar>
      )}
    </div>
  );
}
