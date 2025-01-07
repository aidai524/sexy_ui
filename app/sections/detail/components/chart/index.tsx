import { useEffect, useMemo, useRef } from "react";
import { TradingViewChart } from "@/app/components/chart";
import TradingViewWidget from "./tradingViewWidget";

export default function Chart({ data, style = {} }: any) {
  const tvRef = useRef<any>();

  const type = useMemo(() => {
    if (data.status === 1 && data.DApp === "sexy") {
      return 1;
    }

    if (data.status >= 1) {
      return 2;
    }

    return 3;
  }, [data]);
  console.log("data", data);
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
        // <TradingViewWidget />

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

      {/* <iframe name="tradingview_5ab5d" src="https://pump.fun/5ccc48dd-05e7-4d05-87de-251cbac32cac" data-widget-options="symbol=DEI&amp;interval=5&amp;widgetbar=%7B%22details%22%3Afalse%2C%22watchlist%22%3Afalse%2C%22news%22%3Afalse%2C%22datawindow%22%3Afalse%2C%22watchlist_settings%22%3A%7B%22default_symbols%22%3A%5B%5D%7D%7D&amp;timeFrames=%5B%7B%22text%22%3A%225y%22%2C%22resolution%22%3A%221W%22%7D%2C%7B%22text%22%3A%221y%22%2C%22resolution%22%3A%221W%22%7D%2C%7B%22text%22%3A%226m%22%2C%22resolution%22%3A%22120%22%7D%2C%7B%22text%22%3A%223m%22%2C%22resolution%22%3A%2260%22%7D%2C%7B%22text%22%3A%221m%22%2C%22resolution%22%3A%2230%22%7D%2C%7B%22text%22%3A%225d%22%2C%22resolution%22%3A%225%22%7D%2C%7B%22text%22%3A%221d%22%2C%22resolution%22%3A%221%22%7D%5D&amp;locale=en&amp;uid=tradingview_5ab5d&amp;clientId=0&amp;userId=0&amp;chartsStorageVer=1.0&amp;debug=false&amp;timezone=Etc%2FUTC&amp;theme=dark" title="Financial Chart" frameborder="0" allowtransparency="true" scrolling="no" allowfullscreen="" ></iframe> */}
    </div>
  );
}
