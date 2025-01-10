import styles from "../action.module.css";
import { MobileBuyIcon, LaptopBuyIcon } from "./buy-icon";
import { MobileSellIcon, LaptopSellIcon } from "./sell-icon";
import TradeModal from "../../trade-modal";
import { useState } from "react";
import type { Project } from "@/app/type";
import { useAccount } from "@/app/hooks/useAccount";
import Boost from "../../boost";
import { useMessage } from "@/app/context/messageContext";

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
  const { showShare } = useMessage();

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
            className={`${styles.actionBtn} ${from === "laptop" &&
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
            {/* {from === "laptop" ? <LaptopBuyIcon /> : <MobileBuyIcon />} */}
            <div>Place Trade</div>
          </div>

          <div className={styles.share} onClick={() => {
            showShare(data)
          }}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_b_6130_118)">
                <circle cx="25" cy="25" r="25" fill="#9290B1" fill-opacity="0.3" />
              </g>
              <circle cx="29.7046" cy="19.5455" r="2.54547" stroke="white" stroke-width="2" />
              <circle cx="29.7046" cy="30.4549" r="2.54547" stroke="white" stroke-width="2" />
              <circle cx="18.4318" cy="25.0004" r="3.63638" fill="white" />
              <path d="M27.5229 20.6362L19.1592 24.9999L27.5229 29.3635" stroke="white" stroke-width="2" />
              <defs>
                <filter id="filter0_b_6130_118" x="-10" y="-10" width="70" height="70" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6130_118" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6130_118" result="shape" />
                </filter>
              </defs>
            </svg>

          </div>

          {/* <Boost token={data} isBigIcon={true} onClick={() => {}}/> */}

          {/* <div
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

              setInitType("sell");
              setTradeShow(true);
            }}
          >
            {from === "laptop" ? <LaptopSellIcon /> : <MobileSellIcon />}
            <div>Sell</div>
          </div> */}
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
