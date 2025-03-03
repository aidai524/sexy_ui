import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import Loading from "@/app/components/icons/loading";
import { LoginBannerList } from "@/app/sections/invite-code/config";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounceFn } from "ahooks";
import { random } from "lodash-es";
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';

const getNextIndex = () => {
  return Math.max(0, Math.min(random(0, LoginBannerList.length - 1), LoginBannerList.length - 1));
};

const InviteCodeConnectWallet: React.FC<any> = (props) => {
  const { className, loading } = props;

  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  const loopTimer = useRef<any>(null);
  const [banner, setBanner] = useState<any>();

  const { run: setBannerDelay } = useDebounceFn((_banner: any) => {
    setBanner(_banner);
  }, { wait: 300 });

  useEffect(() => {
    const toggleBanner = () => {
      const getNext = (cb: any) => {
        const nextIndex = getNextIndex();
        const next = LoginBannerList[nextIndex];
        if (!next || next.key === banner?.key) {
          getNext(cb);
          return;
        }
        cb(next);
      };

      getNext((next: any) => {
        setBanner(void 0);
        setBannerDelay(next);
      });
    };
    toggleBanner();
    loopTimer.current = setInterval(toggleBanner, 5000);
    return () => {
      clearInterval(loopTimer.current);
    }
  }, []);

  return (
    <div className={clsx(styles.InviteCodeConnectWalletContainer, className)}>
      <div className={styles.BannerWrapper}>
        <AnimatePresence>
          {
            banner && (
              <motion.img
                src={banner.img}
                alt=""
                className={styles.Banner}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: [50, 0] }}
                exit={{ opacity: 0, y: -50 }}
                transition={{
                  duration: 0.3,
                }}
              />
            )
          }
        </AnimatePresence>
      </div>
      {
        (loading || (!!address && !!accountRefresher)) ? (
          <button
            type="button"
            className={styles.Button}
          >
            <Loading size={16} />
            <div>Connect Wallet</div>
          </button>
        ) : (
          <WalletModalButton style={{ marginTop: 0 }}>
            Connect Wallet
          </WalletModalButton>
        )
      }
    </div>
  );
};

export default InviteCodeConnectWallet;
