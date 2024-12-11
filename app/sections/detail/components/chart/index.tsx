import { useEffect, useRef } from "react";
import { TradingViewChart } from "@/app/components/chart";

export default function Chart({ data }: any) {
  const tvRef = useRef<any>();

  if (!data) return <div />;
  return (
    <div style={{ paddingTop: 10, height: "calc(100vh - 130px)" }}>
      {data.lanched && (
        <iframe
          style={{ height: "100%" }}
          id="dextools-widget"
          title="DEXTools Trading Chart"
          width="100%"
          frameBorder="none"
          src="https://dexscreener.com/near/refv1-4276?embed=1&theme=dark&info=0&trades=0"
        ></iframe>
      )}
      {!data.lanched && (
        <TradingViewChart
          style={{ height: "100%" }}
          symbol={data.tokenName}
          onLoaded={() => {}}
          forwardedRef={tvRef}
        />
      )}
    </div>
  );
}
