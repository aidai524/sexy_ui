import { useEffect, useState } from "react";
import { Trend } from "@/app/sections/trends/hooks/index";
import { add } from "lodash-es";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";

export function useTrade() {
  const [tradeToken, setTradeToken] = useState<any>({});

  const { getPool } = useTokenTrade({
    tokenName: tradeToken.tokenName,
    tokenSymbol: tradeToken.tokenSymbol,
    tokenDecimals: tradeToken.tokenDecimals,
    loadData: false
  });

  useEffect(() => {
    if (tradeToken) {
      getPool();
    }
    
  }, [getPool, tradeToken]);

  const onTrade = (token: Trend) => {
    if (!token) return;

    setTradeToken({
      DApp: 'sexy',
      tokenName: token?.token_name,
      tokenSymbol: token?.token_symbol,
      tokenIcon: token?.Icon,
      ticker: token?.ticker,
      tokenDecimals: token?.token_decimals,
      tickerAvatar: "",
      address: token?.address,
      status: token?.status || 1,
    });
  };

  return {
    tradeToken,
    onTrade,
    setTradeToken
  };
}
