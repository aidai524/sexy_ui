"use client";

import { TabBar } from "antd-mobile";
import { useRouter, usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WalletModalButton,
  useWalletModal
} from "@solana/wallet-adapter-react-ui";
import {
  bufferToBase64,
  getAuthorization,
  getAuthorizationByLocal,
  getAuthorizationByLocalAndServer,
  httpGet,
  initAuthorization
} from "@/app/utils";
import LoginModal from '@/app/components/loginModal'
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";

function CustomIcon({
  url,
  showPlus = false
}: {
  url: string;
  showPlus?: boolean;
}) {
  const { likeTrigger } = useMessage();

  return (
    <div className={styles.tabIconWapper}>
      <img className={styles.tabIcon} src={url} />
      {showPlus && (
        <div
          className={styles.showPlus + " " + (likeTrigger ? styles.ani : "")}
        >
          +1
        </div>
      )}
    </div>
  );
}

const CreateIcon = <div className={ styles.createIcon }>
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 0L17.7813 10.2187L28 14L17.7813 17.7813L14 28L10.2187 17.7813L0 14L10.2187 10.2187L14 0Z" fill="white"/>
</svg>

</div>

const tabs = [
  {
    key: "/",
    title: 'CLUB',
    icon: <CustomIcon url="/img/tabs/tab1.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab1-active.svg" />
  },
  {
    key: "/discover",
    title: 'DISCOVER',
    icon: <CustomIcon url="/img/tabs/tab5.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab5-active.svg" />
  },
  {
    key: "/create",
    title: 'CREATE',
    icon: CreateIcon,
    iconActive: <CustomIcon url="/img/tabs/tab3-active.svg" />
  },
  {
    key: "/mining",
    title: 'MINING',
    icon: <CustomIcon showPlus={true} url="/img/tabs/tab2.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab2-active.svg" />
  },
  {
    key: "/profile",
    title: 'PROFILE',
    icon: <CustomIcon url="/img/tabs/tab4.svg" />,
    iconActive: <CustomIcon url="/img/tabs/tab4-active.svg" />
  },
];

export default function Component({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { address, walletProvider, connect, disconnect } = useAccount();


  const showTabs = useMemo(() => {
    return tabs.find((tab) => {
      if (tab.key === "/") {
        return pathname === tab.key;
      }
      return pathname.indexOf(tab.key) === 0;
    });
  }, [pathname]);

  const initToken = useCallback(async () => {
    const auth = await getAuthorizationByLocalAndServer();
    if (!auth) {
      initAuthorization();
    }
  }, [address]);

  useEffect(() => {
    // @ts-ignore
    window.connect = () => {
      setShowLoginModal(true)
    };
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }

    // @ts-ignore
    window.walletProvider = walletProvider;
    // @ts-ignore
    window.sexAddress = address;

    initToken();
  }, [address]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pb-16">{children}</main>

      <LoginModal modalShow={showLoginModal} onHide={() => {
        setShowLoginModal(false)
      }} />

      {showTabs && (
        <TabBar
          className={styles.tabBar}
          activeKey={pathname}
          safeArea={true}
          onChange={(key) => {
            if (key !== '/') {
              if (!address) {
                // @ts-ignore
                window.connect()
                return
              }
            } 
            router.push(key)
          }}
        >
          {
            tabs.map((item) => {
              if (item.title === 'CREATE') {
                return <TabBar.Item
                  key={item.key}
                  icon={item.icon}
                  className={styles.activeTab}
                  title={''}
                />
              }
              return <TabBar.Item
                key={item.key}
                icon={pathname === item.key ? item.iconActive : item.icon}
                className={styles.activeTab}
                title={item.title}
              />
            })
          }
        </TabBar>
      )}
    </div>
  );
}
