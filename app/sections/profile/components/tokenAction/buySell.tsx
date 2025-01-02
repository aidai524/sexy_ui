import TradeModal from "@/app/components/trade-modal";
import styles from "./index.module.css";
import { useState } from "react";
import type { Project } from "@/app/type";

interface Props {
  token: Project;
}

export default function BuySell({ token }: Props) {
  const [tradeShow, setTradeShow] = useState(false);

  return (
    <>
      <button
        className={`${styles.ActionBtn} ${styles.Flip} button`}
        onClick={() => {
          setTradeShow(true);
        }}
      >
        <BuySellIcon />
        Buy
      </button>

      <TradeModal
        show={tradeShow}
        onClose={() => {
          setTradeShow(false);
        }}
        data={token}
        initType={"buy"}
      />
    </>
  );
}

function BuySellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16.8641 16.8644C20.5185 13.21 21.0571 7.82379 18.0672 4.83387L15.0687 2.04419L2.72827 15.9621L4.83361 18.0674C7.82353 21.0574 13.2098 20.5187 16.8641 16.8644Z"
        fill="#577123"
      />
      <path
        d="M3.02849 3.02849C6.68284 -0.625858 12.2037 -1.02983 15.3598 2.1262C18.5158 5.28223 18.1118 10.8031 14.4575 14.4575C10.8031 18.1118 5.28223 18.5158 2.1262 15.3598C-1.02983 12.2037 -0.625858 6.68284 3.02849 3.02849Z"
        fill="#C9FF5D"
      />
      <path
        d="M12.6333 8.59277L4.55179 8.59277"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.59277 12.6333L8.59277 4.55179"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
