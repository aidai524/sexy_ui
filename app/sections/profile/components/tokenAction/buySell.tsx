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
        className={`${styles.ActionBtn} ${styles.Withdraw} button`}
        onClick={() => {
          setTradeShow(true);
        }}
      >
        {/* <BuySellIcon /> */}
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
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.181 24.1811C28.5017 19.8605 29.1385 13.4921 25.6034 9.95706L22.0474 6.40104L7.46773 23.1143L9.95695 25.6036C13.492 29.1386 19.8604 28.5018 24.181 24.1811Z"
        fill="#577123"
      />
      <ellipse
        cx="14.5799"
        cy="14.5795"
        rx="9.55505"
        ry="11.0637"
        transform="rotate(-135 14.5799 14.5795)"
        fill="#C9FF5D"
      />
      <path
        d="M19.1796 14.4023L9.62451 14.4023"
        stroke="#577123"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M14.4021 19.1794L14.4021 9.62439"
        stroke="#577123"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
}
