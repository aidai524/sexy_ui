"use client";

import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile";
import Laptop from "./laptop";
import BuyModal from "@/app/sections/trends/components/buy";
import { useTrade } from "@/app/sections/trends/hooks/trade";
import { useState } from "react";
import { Trend } from "@/app/sections/trends/hooks";

export default function Trends() {
  const { isMobile } = useUserAgent();
  const { tradeToken, onTrade, setTradeToken } = useTrade();

  const [visible, setVisible] = useState(false);

  const handleBuy = (trend?: Trend) => {
    if (!trend) return;
    onTrade(trend);
    setVisible(true);
  };

  const handleBuyClose = () => {
    setVisible(false);
    setTradeToken({});
  };

  return (
    <>
      {isMobile ? (
        <Mobile handleBuy={handleBuy} />
      ) : (
        <Laptop handleBuy={handleBuy} />
      )}
      <BuyModal
        visible={visible}
        tradeToken={tradeToken}
        onClose={handleBuyClose}
      />
    </>
  );
}
