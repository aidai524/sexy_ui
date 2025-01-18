import styles from "./index.module.css";
import { useReferStore } from "@/app/store/useRefer";
import Modal from "@/app/components/modal";
import { fail, success } from "@/app/utils/toast";
import { useAccount } from "@/app/hooks/useAccount";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
import Tab, {
  AnimateVariants,
  TabTitle
} from "@/app/components/layout/laptop/user/refer/modal/tab";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/app/components/icons/loading";
import { useAirdrop } from "@/app/components/airdrop/hooks";
import { useUser } from '@/app/store/useUser';
import useUserInfo from '@/app/hooks/useUserInfo';
import Big from 'big.js';
import { SOL } from '@/app/components/trade/buySellPump';
import { numberFormatter } from '@/app/utils/common';

const ReferModal = (props: any) => {
  const { isMobile } = props;
  const store = useReferStore();
  const { hasShownTour } = useGuidingTour();

  const handleClose = () => {
    store.setVisible(false);
  };

  return (
    <Modal
      open={store.visible && hasShownTour}
      onClose={handleClose}
      style={{}}
      mainStyle={{
        border: 0
      }}
      maskClose={false}
    >
      <ReferModalContent {...props} isInvite={store.isInvite} />
    </Modal>
  );
};

export default ReferModal;

const ReferModalContent = (props: any) => {
  const { userInfo, isMobile, isInvite } = props;
  const { address } = useAccount();
  const { getAirdropData, airdropData } = useAirdrop();
  const userStore: any = useUser();
  const { fecthUserInfo } = useUserInfo(address, true, 0);

  const [currentTab, setCurrentTab] = useState(isInvite ? 2 : 1);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (loading) return;
    setLoading(true);
    const shareLink = new URL(window?.location?.origin);
    shareLink.searchParams.set("referral", address ?? "");
    if (currentTab === 2) {
      // this api had been deleted
      // const res = await httpAuthGet("/airdrop/referral/code", {
      //   find: false
      // });
      // if (res.code !== 0) {
      //   fail("Failed to obtain the invitation code");
      //   setLoading(false);
      //   return;
      // }
      shareLink.searchParams.set("airdrop", "1");
    }
    navigator.clipboard
      .writeText(shareLink.toString())
      .then(() => {
        success("Copied share link!", { maskStyle: { zIndex: 2000 } });
      })
      .catch((err) => {
        fail("Copy failed!", { maskStyle: { zIndex: 2000 } });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTab = (tab: number) => {
    if (currentTab === tab) return;
    setCurrentTab(tab);
  };

  const getUserData = async () => {
    if (!address) return;
    const userInfo = await fecthUserInfo(address);
    userStore.set({ userInfo });
  };

  useEffect(() => {
    if (!address) return;
    getAirdropData();
    getUserData();
  }, [address]);

  return (
    <div className={isMobile ? styles.ContainerMobile : styles.Container}>
      <div className={styles.Body}>
        <div className={isMobile ? styles.TitleMobile : styles.Title}>
          Referral Earning
        </div>
        <div className={isMobile ? styles.ContentMobile : styles.Content}>
          <div
            className={styles.EarnedWrapper}
          >
            <div
              className={isMobile ? styles.EarnedTabsMobile : styles.EarnedTabs}
            >
              <motion.div
                className={styles.EarnedTabsCursor}
                animate={{
                  x: `${(currentTab - 1) * 100}%`
                }}
              />
              <TabTitle
                {...props}
                label="EARNED"
                value={numberFormatter(Big(userInfo?.referralFee || 0).div(10 ** SOL.tokenDecimals), 4, true, { isShort: true })}
                unit="SOL"
                tab={1}
                current={currentTab}
                onClick={() => handleTab(1)}
              />
              <TabTitle
                {...props}
                label="EARNED"
                value={numberFormatter(airdropData?.airdrop_points, 4, true, { isShort: true })}
                unit="Points"
                tab={2}
                current={currentTab}
                onClick={() => handleTab(2)}
              />
            </div>
            <AnimatePresence mode="wait">
              {currentTab === 1 && (
                <Tab
                  key={1}
                  {...props}
                  bg="/img/home/refer-modal-content-bg-1.svg"
                  list={[
                    {
                      key: 1,
                      value: 25,
                      icon: "/img/home/refer-modal-progress-node.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-active.svg",
                      label: "Vol.50k",
                      amount: 0.55,
                      unit: "SOL",
                      perUnit: "Month"
                    },
                    {
                      key: 2,
                      value: 50,
                      icon: "/img/home/refer-modal-progress-node.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-active.svg",
                      label: "Vol.250k",
                      amount: 13.75,
                      unit: "SOL",
                      perUnit: "Month"
                    },
                    {
                      key: 1,
                      value: 75,
                      icon: "/img/home/refer-modal-progress-node.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-active.svg",
                      label: "Vol.500k",
                      amount: 27.5,
                      unit: "SOL",
                      perUnit: "Month"
                    },
                    {
                      key: 1,
                      value: 100,
                      icon: "/img/home/refer-modal-progress-node.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-active.svg",
                      label: "Vol.1m",
                      amount: 55,
                      unit: "SOL",
                      perUnit: "Month"
                    }
                  ]}
                />
              )}
              {currentTab === 2 && (
                <Tab
                  key={2}
                  {...props}
                  bg="/img/home/refer-modal-content-bg-2.svg"
                  list={[
                    {
                      key: 1,
                      value: 25,
                      icon: "/img/home/refer-modal-progress-node-pts.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-pts-active.svg",
                      label: "10K pts",
                      amount: "1K",
                      unit: "pts",
                      perUnit: "Extra"
                    },
                    {
                      key: 2,
                      value: 50,
                      icon: "/img/home/refer-modal-progress-node-pts.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-pts-active.svg",
                      label: "100K pts",
                      amount: "10K",
                      unit: "pts",
                      perUnit: "Extra"
                    },
                    {
                      key: 1,
                      value: 75,
                      icon: "/img/home/refer-modal-progress-node-pts.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-pts-active.svg",
                      label: "1M pts",
                      amount: "100K",
                      unit: "pts",
                      perUnit: "Extra"
                    },
                    {
                      key: 1,
                      value: 100,
                      icon: "/img/home/refer-modal-progress-node-pts.svg",
                      iconActive:
                        "/img/home/refer-modal-progress-node-pts-active.svg",
                      label: "10M pts",
                      amount: "1M",
                      unit: "pts",
                      perUnit: "Extra"
                    }
                  ]}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={isMobile ? styles.InviteMobile : styles.Invite}>
          <AnimatePresence mode="wait">
            {currentTab === 1 && (
              <motion.div
                key={1}
                className={styles.InviteText}
                {...AnimateVariants}
              >
                Users invite more than <strong className={styles.InviteTextPrimary}>1,000</strong> people and get <strong
                className={styles.InviteTextPrimary}
              >50%</strong> Referral kickback
              </motion.div>
            )}
            {currentTab === 2 && (
              <motion.div
                key={2}
                className={styles.InviteText}
                {...AnimateVariants}
              >
                Users invite more than <strong className={styles.InviteTextPrimary}>1,000</strong> people and get <strong
                className={styles.InviteTextPrimary}
              >50%</strong> Referral kickback
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.Footer}>
        <button
          type="button"
          className={styles.InviteBtn}
          onClick={handleCopy}
          disabled={loading}
        >
          {loading && <Loading size={16} />}
          <span>Invite now</span>
        </button>
      </div>
    </div>
  );
};
