import { useEffect, useMemo, useRef } from "react";
import { TradingViewChart } from "@/app/components/chart";
import TradingViewWidget from "./tradingViewWidget";

export default function Chart({ data, style = {} }: any) {
  const tvRef = useRef<any>();

  const type = useMemo(() => {
    if (data.status === 1 && data.DApp === 'sexy') {
      return 1
    }

    if (data.status >= 1 ) {
      return 2
    }

    return 3
  }, [data])

  if (!data) return <div />;
  return (
    <div style={{ paddingTop: 10, height: "calc(100vh - 130px)", ...style }}>
      {/* {type === 2 && (
        // <iframe
        //   style={{ height: "100%" }}
        //   id="dextools-widget"
        //   title="DEXTools Trading Chart"
        //   width="100%"
        //   frameBorder="none"
        //   src="https://dexscreener.com/near/refv1-4276?embed=1&theme=dark&info=0&trades=0"
        // ></iframe>

        // <iframe style={{ height: "100%", width: '100%' }} frameBorder="none" src={`https://dexscreener.com/solana/${data.address}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}></iframe>
        <TradingViewWidget />
      )} */}
      {type === 1 && (
        <TradingViewChart
          style={{ height: "100%" }}
          symbol={data.tokenName}
          address={data.address}
          onLoaded={() => {}}
          forwardedRef={tvRef}
        />
      )}
    </div>
  );
}
