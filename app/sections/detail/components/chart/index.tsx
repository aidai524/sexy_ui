import { useMemo, useRef, useState } from "react";
import { TradingViewChart } from "@/app/components/chart";
import type { Project } from "@/app/type";
import { usePair } from "../hooks/usePair";
import Resolutions from "./resolutions";

interface Props {
  token: Project;
  style?: any;
}

export default function Chart({ token, style = {} }: Props) {
  const tvRef = useRef<any>();
  const type = useMemo(() => {
    if (!token) return 0;
    if (token.status === 1) {
      return 1;
    }

    if (token.status === 3) {
      return 2;
    }

    return 0;
  }, [token]);

  const { pair } = usePair({ token, type });
  const [resolution, setResolution] = useState(1);
  const chartRef = useRef<any>();

  if (!token) return <div />;

  return (
    <div
      style={{
        paddingTop: 10,
        height: "400px",
        position: "relative",
        ...style
      }}
    >
      {type === 2 && pair && (
        <iframe
          width="100%"
          frameBorder="none"
          src={`https://dexscreener.com/solana/${pair}?embed=1&loadChartSettings=0&trades=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=3`}
          style={{ height: "100%", width: "100%" }}
        ></iframe>
      )}
      {type === 1 && (
        <>
          <Resolutions
            currentTab={resolution}
            onChange={(tab: any) => {
              if (!chartRef.current?.chart?.()) return;
              setResolution(tab);
              chartRef.current.chart().setResolution(String(tab));
            }}
          />
          <TradingViewChart
            style={{ height: "100%" }}
            symbol={token.tokenName}
            address={token.address as string}
            onLoaded={(chart: any) => {
              chartRef.current = chart;
            }}
            forwardedRef={tvRef}
          />
        </>
      )}
    </div>
  );
}
