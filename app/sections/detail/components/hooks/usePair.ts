import { fetchSwapInfo } from "@/app/hooks/useJupiter";
import type { Project } from "@/app/type";
import { useEffect, useState } from "react";

export function usePair({ token, type }: { token: Project; type: number }) {
  const [pair, setPair] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    if (type === 2) {
      fetchSwapInfo('So11111111111111111111111111111111111111112', token.address as string, "100", 30).then((res: any) => {
        if (res && res.quoteResponse?.routePlan && res.quoteResponse.routePlan.length > 0 && res.quoteResponse.routePlan[0].swapInfo?.ammKey) {
          setPair(res.quoteResponse.routePlan[0].swapInfo.ammKey);
        } else {
          setPair(null);
        }
      }).catch((err) => {
        setPair(null);
      });
    }

  }, [token, type]);

  return {
    pair,
    setPair
  };
}
