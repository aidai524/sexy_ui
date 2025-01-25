import { useWallet } from "@/app/hooks/use-wallet";
import { AnimatePresence, motion } from "framer-motion";
import { ReadAvatar } from "@/app/sections/messages/avatar";
import InfoIcon from "../../icons/info";
import HowToWork from "../../how-to-work";
import styles from "./index.module.css";
import Level from "../../level";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";
import useSolBalance from "@/app/hooks/use-sol-balance";

export default function Info({ logout }: any) {
  const { wallet, publicKey } = useWallet();
  const [expand, setExpand] = useState(false);
  const [showHowItWork, setShowHowItWork] = useState(false);
  const { userInfo } = useAuth();
  const { solBalance } = useSolBalance(Number(expand));

  useEffect(() => {
    const close = () => {
      setExpand(false);
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  const Avatar = () => (
    <div className={styles.Avatar}>
      {userInfo?.icon ? (
        <img src={userInfo.icon} className={`${styles.Logo}`} />
      ) : (
        <ReadAvatar size={30} />
      )}
    </div>
  );

  return wallet ? (
    <>
      <div className={`${styles.Container}`}>
        <div
          className={`${styles.Box} button`}
          onClick={(ev) => {
            setExpand(!expand);
            ev.stopPropagation();
            ev.nativeEvent.stopImmediatePropagation();
          }}
        >
          <Avatar />
        </div>
        {expand && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className={styles.Panel}
            onClick={(ev) => {
              ev.stopPropagation();
              ev.nativeEvent.stopImmediatePropagation();
            }}
          >
            <div className={styles.PanelTitle}>
              <div className={styles.Flex}>
                <Avatar />
                <div className={styles.PanelAddress}>
                  {publicKey?.toString().slice(0, 4)}....
                  {publicKey?.toString().slice(-4)}
                </div>
              </div>
              <Level level={userInfo?.level} vipType={userInfo.vipType} />
            </div>
            <div className={styles.BalanceWrapper}>
              <div className={styles.Wallet}>
                <img
                  src={(wallet as any).meta?.icon || (wallet as any).adapter?.icon}
                  className={`${styles.WalletIcon}`}
                />
                <span>{(wallet as any).meta?.name || (wallet as any).adapter?.name}</span>
              </div>
              <div className={styles.PanelSol}>
                <img src="/img/home/solana.png" className={styles.SolnaIcon} />
                <div>{solBalance}</div>
              </div>
            </div>
            <button
              className={`${styles.Disconnect} button`}
              onClick={(ev) => {
                logout?.(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M11.1333 1H1V16.2H11.1333"
                  stroke="#FF70D9"
                  strokeWidth="2"
                />
                <path
                  d="M7.33325 8.6001H13.6666"
                  stroke="#FF70D9"
                  strokeWidth="2"
                />
                <path
                  d="M17.4666 8.59987L13.6666 12.9877L13.6666 4.21201L17.4666 8.59987Z"
                  fill="#FF70D9"
                />
              </svg>
              <span>Disconnect</span>
            </button>
            {/* <div
              className={styles.PanelTitle}
              style={{
                margin: "34px 0px 18px"
              }}
            >
              MENU
            </div> */}
            {/* <div className={`${styles.Item} button`}>
              <XIcon />
              <span>Twitter</span>
            </div>
            <div className={`${styles.Item} button`}>
              <TelegramIcon />
              <span>Telegram</span>
            </div> */}
            {/* <div
              className={`${styles.Item} button`}
              onClick={() => {
                setShowHowItWork(true);
              }}
            >
              <InfoIcon />
              <span>How it works</span>
            </div> */}
          </motion.div>
        )}
      </div>
      {/* <HowToWork
        open={showHowItWork}
        onClose={() => {
          setShowHowItWork(false);
        }}
      /> */}
    </>
  ) : null;
}
