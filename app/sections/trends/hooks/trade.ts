import { useState } from 'react';
import { Trend } from '@/app/sections/trends/hooks/index';

export function useTrade() {
  const [tradeToken, setTradeToken] = useState<any>({});

  const onTrade = (token: Trend) => {
    if (!token) return;
    setTradeToken({
      DApp: 'pump',
      tokenName: token?.token_name,
      tokenSymbol: token?.token_symbol,
      tokenIcon: token?.Icon,
      ticker: token?.ticker,
      tokenDecimals: 18,
      tickerAvatar: '',
    });
  };

  return {
    tradeToken,
    onTrade,
    setTradeToken,
  };
}
