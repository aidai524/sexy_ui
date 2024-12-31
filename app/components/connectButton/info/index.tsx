import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import XIcon from "../../icons/x";
import TelegramIcon from "../../icons/telegram";
import InfoIcon from "../../icons/info";
import HowToWork from "../../how-to-work";
import styles from "./index.module.css";
import Big from "big.js";
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

export default function Info({ logout }: any) {
  const { wallet, publicKey, disconnect } = useWallet();
  const [expand, setExpand] = useState(false);
  const [solBalance, setSolBalance] = useState("0");
  const [showHowItWork, setShowHowItWork] = useState(false);
  const { connection } = useConnection();

  useEffect(() => {
    if (!publicKey || !connection) return;
    connection.getBalance(publicKey!).then((res) => {
      if (res) {
        setSolBalance(new Big(res).div(10 ** 9).toFixed(2));
      } else {
        setSolBalance("0");
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    const close = () => {
      setExpand(false);
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

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
          <img src={wallet.adapter.icon} className={styles.Logo} />
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            animate={{
              rotate: expand ? "-180deg" : "0deg"
            }}
          >
            <path
              d="M12.3136 1.6283L6.65674 7.28516L0.999884 1.6283"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
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
            <div className={styles.PanelTitle}>WALLET</div>
            <div className={styles.PanelAddressBox}>
              <div className={styles.PanelAddress}>
                {publicKey?.toString().slice(0, 7)}....
                {publicKey?.toString().slice(-3)}
              </div>
              <div className={styles.PanelSol}>
                <img src="/img/home/solana.png" className={styles.SolnaIcon} />
                <div>{solBalance}</div>
              </div>
            </div>
            <button
              className={`${styles.Disconnect} button`}
              onClick={(ev) => {
                console.log("101");
                disconnect();
                logout?.();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <path
                  d="M8.84619 9.49997V1"
                  stroke="#6A7279"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M4.92306 3.35742C2.57785 4.71405 1 7.2497 1 10.1539C1 14.4872 4.51283 18 8.84613 18C13.1794 18 16.6923 14.4872 16.6923 10.1539C16.6923 7.2497 15.1144 4.71405 12.7692 3.35742"
                  stroke="#6A7279"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Disconnect</span>
            </button>
            <div
              className={styles.PanelTitle}
              style={{
                margin: "34px 0px 18px"
              }}
            >
              MENU
            </div>
            <div className={`${styles.Item} button`}>
              <XIcon />
              <span>Twitter</span>
            </div>
            <div className={`${styles.Item} button`}>
              <TelegramIcon />
              <span>Telegram</span>
            </div>
            <div
              className={`${styles.Item} button`}
              onClick={() => {
                setShowHowItWork(true);
              }}
            >
              <InfoIcon />
              <span>How it works</span>
            </div>
          </motion.div>
        )}
      </div>
      <HowToWork
        open={showHowItWork}
        onClose={() => {
          setShowHowItWork(false);
        }}
      />
    </>
  ) : null;
}
