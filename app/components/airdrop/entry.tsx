"use client";

import AirdropModal from "@/app/components/airdrop/modal";
import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { useAirdropStore } from "@/app/store/use-airdrop";
import { useReferralStore } from "@/app/store/useReferral";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./index.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";
import { useConfig } from "@/app/store/useConfig";
import { useRouter } from "next/navigation";

const AirdropEntry = (props: any) => {
  const { isMobile } = props;
  const search = useSearchParams();
  const pathname = usePathname();
  const {
    setVisible: setAirdropVisible,
    setConnectVisible,
    visible: airdropVisible
  } = useAirdropStore();
  const { setReferral } = useReferralStore();
  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  const airdropEntryRef = useRef<any>(null);
  const [mobileDropped, setMobileDropped] = useState(false);

  const { run: setConnectVisibleDelay, cancel: setConnectVisibleDelayCancel } =
    useDebounceFn(
      () => {
        setConnectVisible?.(true);
      },
      { wait: 2000 }
    );

  const isAirdrop = useMemo(() => {
    if (!search.get("referral")) return false;
    if (!Cookies.get("referral")) {
      console.log("referral saved: %o", search.get("referral"));
      Cookies.set("referral", search.get("referral") as string, { path: "/" });
      setReferral(search.get("referral") as string);
    }
    if (!search.get("airdrop")) return false;
    // not connected wallet
    setConnectVisibleDelayCancel();
    if (!address || !accountRefresher) {
      setConnectVisibleDelay();
      return false;
    }
    if (address.toString() === search.get("referral")) return false;
    setConnectVisible(false);
    return true;
  }, [search, address, accountRefresher]);

  const isShownEntry = useMemo(() => {
    if (pathname !== "/") return false;
    return true;
  }, [isMobile, pathname, airdropVisible]);

  useEffect(() => {
    setAirdropVisible(isAirdrop);
  }, [isAirdrop]);

  useEffect(() => {
    if (!isShownEntry) {
      setMobileDropped(false);
    }
  }, [isShownEntry]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isShownEntry && (
          <motion.div
            ref={airdropEntryRef}
            className={styles.AirdropEntryMobile}
            variants={{
              visible: {
                scale: 1,
                x: 0,
                y: 330
              },
              invisible: {
                scale: 0.5,
                x: -70,
                y: 330
              },
              visibleMobile: {
                scale: 1,
                y: 0
              },
              invisibleMobile: {
                scale: 0.5,
                y: -100
              }
            }}
            initial={isMobile ? "invisibleMobile" : "invisible"}
            animate={isMobile ? "visibleMobile" : "visible"}
            exit={isMobile ? "invisibleMobile" : "invisible"}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 1,
              duration: 0.9
            }}
            onAnimationComplete={() => {
              setMobileDropped(true);
              if (airdropEntryRef.current) {
                const timer = setTimeout(() => {
                  clearTimeout(timer);
                  try {
                    airdropEntryRef.current.style.backgroundImage = "unset";
                  } catch (err: any) {
                    console.log(err);
                  }
                }, 1000);
              }
            }}
          >
            {
              <AnimatePresence mode="wait">
                {mobileDropped && (
                  <AirdropEntryMobile
                    onClose={() => {
                      setMobileDropped(false);
                    }}
                  />
                )}
              </AnimatePresence>
            }
          </motion.div>
        )}
      </AnimatePresence>
      <AirdropModal />
    </>
  );
};

export default AirdropEntry;

const AirdropEntryMobile = (props: any) => {
  const { onClose } = props;
  const configStore: any = useConfig();
  const router = useRouter();
  const { setVisible: setAirdropVisible, setConnectVisible } =
    useAirdropStore();

  const handleAirdropOpen = () => {
    if (configStore.config.airdropReady) {
      if (!window.sexAddress) {
        setConnectVisible(true);
        return;
      }
      setAirdropVisible(true);
      return;
    }

    router.push("/airdrop");
  };

  useEffect(() => {
    return () => {
      onClose?.();
    };
  }, []);

  return (
    <motion.div
      className={styles.AirdropEntryMobileInner}
      animate={{
        rotate: [0, -25, 25, -20, 20, -10, 10, -5, 5, 0]
      }}
      transition={{
        delay: 15,
        duration: 1,
        repeat: Infinity,
        repeatDelay: 10
      }}
      onClick={handleAirdropOpen}
    />
  );
};
