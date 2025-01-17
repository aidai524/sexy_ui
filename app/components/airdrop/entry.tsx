'use client';

import AirdropModal from '@/app/components/airdrop/modal';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAirdropStore } from '@/app/store/use-airdrop';
import { useReferralStore } from '@/app/store/useReferral';
import { useAccount } from '@/app/hooks/useAccount';
import styles from './index.module.css';
import { AnimatePresence, motion } from 'framer-motion';

const AirdropEntry = (props: any) => {
  const { isMobile } = props;

  const search = useSearchParams();
  const pathname = usePathname();
  const { setVisible: setAirdropVisible, setConnectVisible, visible: airdropVisible } = useAirdropStore();
  const { setReferral } = useReferralStore();
  const { address } = useAccount();

  const airdropEntryRef = useRef<any>(null);
  const [mobileDropped, setMobileDropped] = useState(false);

  const isAirdrop = useMemo(() => {
    if (!address) return false;
    if (!search.get("referral")) return false;
    if (address.toString() === search.get("referral")) return false;
    if (!Cookies.get("referral")) {
      console.log("referral saved: %o", search.get("referral"));
      Cookies.set("referral", search.get("referral") as string, { path: "/" });
      setReferral(search.get("referral") as string);
    }
    if (!search.get("airdrop")) return false;
    // not connected wallet
    if (!address) {
      setConnectVisible(true);
      return false;
    }
    setConnectVisible(false);
    return true;
  }, [search, address]);

  const isMobileShownEntry = useMemo(() => {
    if (!isMobile) return false;
    if (pathname !== '/') return false;
    if (airdropVisible) return false;
    return true;
  }, [isMobile, pathname, airdropVisible]);

  useEffect(() => {
    setAirdropVisible(isAirdrop);
  }, [isAirdrop]);

  useEffect(() => {
    if (!isMobileShownEntry) {
      setMobileDropped(false);
    }
  }, [isMobileShownEntry]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isMobileShownEntry && (
          <motion.div
            ref={airdropEntryRef}
            className={styles.AirdropEntryMobile}
            initial={{
              scale: 0.5,
              y: -100,
            }}
            animate={{
              scale: 1,
              y: 0,
            }}
            exit={{
              scale: 0.5,
              y: -100,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: 3,
              duration: 5,
            }}
            onAnimationComplete={() => {
              setMobileDropped(true);
              if (airdropEntryRef.current) {
                const timer = setTimeout(() => {
                  clearTimeout(timer);
                  try {
                    airdropEntryRef.current.style.backgroundImage = 'unset';
                  } catch (err: any) {
                    console.log(err);
                  }
                }, 1000);
              }
            }}
          >
            {
              <AnimatePresence mode="wait">
                {
                  mobileDropped && (
                    <AirdropEntryMobile
                      onClose={() => {
                        setMobileDropped(false);
                      }}
                    />
                  )
                }
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

  const { setVisible: setAirdropVisible } = useAirdropStore();

  const handleAirdropOpen = () => {
    setAirdropVisible(true);
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
        rotate: [0, -25, 25, -20, 20, -10, 10, -5, 5, 0],
      }}
      transition={{
        delay: 15,
        duration: 1,
        repeat: Infinity,
        repeatDelay: 10,
      }}
      onClick={handleAirdropOpen}
    />
  );
};
