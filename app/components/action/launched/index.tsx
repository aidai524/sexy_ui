import styles from "../action.module.css";
import { MobileBuyIcon, LaptopBuyIcon } from "./buy-icon";
import { MobileSellIcon, LaptopSellIcon } from "./sell-icon";
import TradeModal from "../../trade-modal";
import { useState } from "react";
import type { Project } from "@/app/type";
import { useAccount } from "@/app/hooks/useAccount";
import Boost from "../../boost";

interface Props {
  data?: Project;
  justPlus?: boolean;
  from?: string;
  style?: any;
}

export default function Action({ data, justPlus = false, from, style }: Props) {
  const [tradeShow, setTradeShow] = useState(false);
  const [initType, setInitType] = useState("buy");
  const { address } = useAccount();

  const usedStyle = justPlus
    ? styles.justPlus
    : styles.action + " " + styles.launched;

  if (!data) {
    return;
  }

  return (
    <div
      key={data.id}
      className={`${usedStyle} ${from === "laptop" && styles.LaptopContainer}`}
      style={style}
    >
      {justPlus ? (
        <>
          <div
            onClick={() => {
              if (!address) {
                //@ts-ignore
                window.connect();
                return;
              }
              setTradeShow(true);
              setInitType("buy");
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle opacity="0.4" cx="18" cy="18" r="18" fill="black" />
              <path
                d="M26.2844 24.9314C30.6051 20.6107 31.2419 14.2424 27.7068 10.7073L24.1508 7.15128L9.57113 23.8646L12.0603 26.3538C15.5954 29.8889 21.9638 29.2521 26.2844 24.9314Z"
                fill="#577123"
              />
              <ellipse
                cx="16.6833"
                cy="15.3297"
                rx="9.55505"
                ry="11.0637"
                transform="rotate(-135 16.6833 15.3297)"
                fill="#C9FF5D"
              />
              <path
                d="M21.283 15.1526L11.7279 15.1526"
                stroke="#577123"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16.5054 19.9297L16.5054 10.3746"
                stroke="#577123"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </>
      ) : (
        <>
          <div
            className={`${styles.actionBtn} ${
              from === "laptop" &&
              styles.LaptopActionButton + " " + styles.LaptopBuyButton
            } button`}
            onClick={() => {
              if (!address) {
                //@ts-ignore
                window.connect();
                return;
              }

              setTradeShow(true);
              setInitType("buy");
            }}
          >
            {from === "laptop" ? <LaptopBuyIcon /> : <MobileBuyIcon />}
            <div>Buy</div>
          </div>

          <Boost token={data} isBigIcon={true} onClick={() => {}}/>

          <div
            className={`${styles.actionBtn} ${
              from === "laptop" &&
              styles.LaptopActionButton + " " + styles.LaptopSellButton
            } button`}
            onClick={() => {
              if (!address) {
                //@ts-ignore
                window.connect();
                return;
              }

              setTradeShow(true);
              setInitType("sell");
            }}
          >
            {from === "laptop" ? <LaptopSellIcon /> : <MobileSellIcon />}
            <div>Sell</div>
          </div>
        </>
      )}
      <TradeModal
        show={tradeShow}
        onClose={() => {
          setTradeShow(false);
        }}
        data={data}
        initType={initType}
      />
    </div>
  );
}
