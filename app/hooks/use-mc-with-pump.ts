import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useState, useEffect, useMemo } from "react";
import useMc from "@/app/hooks/useMc";

export default function useMcWithPump(token: any) {
  const [flipMc, setFlipMC] = useState<string | number>("-");
  const { mc: pumpMc } = useMc({
    tokenAddress: token?.address,
    disable: token?.status < 1
  });

  const { getMC, pool } = useTokenTrade({
    tokenName: token?.tokenName as string,
    tokenSymbol: token?.tokenSymbol as string,
    tokenDecimals: token?.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    if (
      pool &&
      pool.length > 0 &&
      token?.DApp === "sexy" &&
      token?.status === 1
    ) {
      getMC().then((res) => {
        setFlipMC(res as number);
      });
    }
  }, [pool, token]);

  return useMemo(() => pumpMc || flipMc, [flipMc, pumpMc]);
}
