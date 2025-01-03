import {
  type ChartingLibraryWidgetOptions,
  type EntityId,
  type IChartingLibraryWidget,
  type ResolutionString,
  type Timezone,
  widget
} from "@/public/libs/charting_library";
import {
  type Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import datafeedFn from "./datafeed";
import { useDebounceFn } from "ahooks";
import Script from "next/script";
import { storageStore } from "@/app/utils/common";
import Loading from "../Loading";

export type TradingViewChartProps = {
  symbol: string;
  address: string;
  style?: any;
  onLoaded?: () => void;
};
export type TradingViewChartExposes =
  | {
      setHorizontalLines: (params: Record<string, number[]>) => void;
      setRectangle: (min: number, max: number) => void;
      resetChart: () => void;
    }
  | undefined;

export default forwardRef(TradingViewChart);

const tvStorage = storageStore("tradingview");

function TradingViewChart(
  { style, symbol, address, onLoaded }: TradingViewChartProps,
  ref: Ref<TradingViewChartExposes>
) {
  useImperativeHandle(ref, () => ({
    setHorizontalLines,
    setRectangle,
    resetChart
  }));

  const tvWidgetRef = useRef<IChartingLibraryWidget>();

  const [loading, setLoading] = useState(false);

  const datafeed = useMemo(() => datafeedFn(address), [address]);

  const { run } = useDebounceFn(
    () => {
      try {
        if (!symbol) return;
        if (!tvWidgetRef.current || loading) initTradingView(symbol);
        else {
          tvWidgetRef.current?.setSymbol(
            symbol,
            getStoredInterval(),
            resetChart
          );
          datafeed.unsubscribeBars("custom");
        }
      } catch (error) {
        console.error("TradingViewChart", error);
      }
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    run();
  }, [symbol]);

  function initTradingView(symbol: string) {
    setLoading(true);
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol,
      theme: "dark",
      datafeed,
      interval: getStoredInterval(),
      container: "TVChartContainer",
      library_path: "/libs/charting_library/",
      locale: "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        "header_quick_search",
        "header_screenshot",
        "header_compare",
        "header_fullscreen_button",
        "header_saveload"
      ],
      enabled_features: ["hide_left_toolbar_by_default"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      header_widget_buttons_mode: "compact",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      studies_overrides: {},
      toolbar_bg: "#171B26",
      loading_screen: {
        backgroundColor: "#000",
        foregroundColor: "#171B26"
      },
      overrides: {
        "paneProperties.background": "#171B26",
        "paneProperties.backgroundType": "solid"
      },
      custom_css_url: "/libs/charting_library/custom-theme.css"
    };

    tvWidgetRef.current = new widget(widgetOptions);

    tvWidgetRef.current.applyOverrides({
      "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker"
    });
    tvWidgetRef.current.onChartReady(() => {
      setLoading(false);
      onLoaded?.();
      const widget = tvWidgetRef.current;
      if (!widget) return;
      // https://www.tradingview.com/charting-library-docs/latest/api/enums/Charting_Library.SeriesType
      widget
        .chart()
        .onIntervalChanged()
        .subscribe(null, function (interval, obj) {
          tvStorage?.set("interval", interval);
        });
      widget.chart().setChartType(10); // 1: Candles 10: Baseline
      widget
        .activeChart()
        .createStudy("Volume", true, false, { id: "volume", visible: true });
      widget?.headerReady().then(() => {
        const button = widget.createButton({
          align: "right",
          useTradingViewStyle: false
        });
        button.addEventListener("click", function () {
          const ele = document.querySelector("#TVChartContainer");
          ele?.classList.toggle("fullscreen");
          if (ele?.classList.contains("fullscreen")) {
            button.innerHTML = exitFullscreenIcon;
            button.setAttribute("title", "Exit Fullscreen");
          } else {
            button.innerHTML = fullscreenIcon;
            button.setAttribute("title", "Fullscreen");
          }
        });
        button.innerHTML = fullscreenIcon;
        button.setAttribute("title", "Fullscreen");
        button.style.cursor = "pointer";
      });
    });
  }

  function resetChart(ids?: EntityId[]) {
    const chart = tvWidgetRef.current?.activeChart();
    if (ids) {
      ids.forEach((id) => {
        chart?.removeEntity(id);
      });
    } else {
      const shapes = chart?.getAllShapes();
      shapes?.forEach((shape) => {
        chart?.removeEntity(shape.id);
      });
    }
  }

  const shapeEntityIds = useRef<EntityId[]>([]);

  function setHorizontalLines(params: Record<string, number[]>) {
    if (shapeEntityIds.current.length > 0) {
      resetChart(shapeEntityIds.current);
      shapeEntityIds.current = [];
    }

    Object.keys(params).forEach((key) => {
      const prices = params[key];
      if (!prices.length) return;
      params[key].forEach((price) => {
        const res = tvWidgetRef.current?.activeChart().createShape(
          { time: 0, price },
          {
            shape: "horizontal_line",
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            text: key === "wait" ? "TrandingView.Wait" : "",
            overrides: {
              showLabel: key === "wait",
              showPrice: false,
              linecolor:
                key === "buy"
                  ? "#00A368"
                  : key === "sell"
                  ? "#EA3F68"
                  : "#BBBBBB",
              linewidth: 2,
              linestyle: key === "wait" ? 1 : 0,
              textcolor: "#AAA",
              vertLabelsAlign: "middle"
            },
            zOrder: "top"
          }
        );
        if (res) {
          shapeEntityIds.current.push(res);
        }
      });
    });
  }

  const rectangleEntityIds = useRef<EntityId[]>([]);

  function setRectangle(min: number, max: number) {
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 2 * 86400;
    if (rectangleEntityIds.current.length > 0) {
      resetChart(rectangleEntityIds.current);
      rectangleEntityIds.current = [];
    }
    const res = tvWidgetRef.current?.activeChart().createMultipointShape(
      [
        { time: startTime, price: min },
        { time: endTime, price: max }
      ],
      {
        shape: "rectangle",
        lock: true,
        disableSelection: true,
        disableSave: true,
        disableUndo: true,
        text: "Mining Range",
        overrides: {
          showLabel: true,
          backgroundColor: "rgba(249, 216, 22, 0.08)",
          color: "#F9D816",
          textColor: "#AAA",
          vertLabelsAlign: "bottom",
          horzLabelsAlign: "right",
          extendLeft: true,
          extendRight: true
        },
        zOrder: "top"
      }
    );
    if (res) {
      rectangleEntityIds.current.push(res);
    }
  }

  return (
    <>
      <Script src="/libs/charting_library/charting_library.standalone.js"></Script>
      <div
        style={{
          position: "relative",
          height: "100%"
        }}
      >
        {loading && <Loading />}
        <div id="TVChartContainer" style={{ width: "100%", ...style }} />
      </div>
    </>
  );
}

function getStoredInterval() {
  const interval = tvStorage?.get("interval") || "1";
  return interval as ResolutionString;
}

const fullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M5 19h2.923q.213 0 .356.144t.144.357q0 .212-.144.356q-.143.143-.356.143H4.808q-.344 0-.576-.232Q4 19.536 4 19.192v-3.115q0-.213.144-.356q.144-.144.357-.144q.212 0 .356.144q.143.143.143.356zm14.02 0v-2.923q0-.213.143-.356t.357-.144q.213 0 .356.144q.143.143.143.356v3.115q0 .344-.232.576q-.232.232-.575.232h-3.116q-.212 0-.356-.144t-.144-.357q0-.212.144-.356q.144-.143.356-.143zM5 5v2.923q0 .213-.144.356t-.357.144q-.212 0-.356-.144Q4 8.136 4 7.923V4.808q0-.344.232-.576Q4.464 4 4.808 4h3.115q.213 0 .356.144q.144.144.144.357q0 .212-.144.356Q8.136 5 7.923 5zm14.02 0h-2.924q-.212 0-.356-.144t-.144-.357q0-.212.144-.356q.144-.143.356-.143h3.116q.343 0 .575.232q.232.232.232.576v3.115q0 .213-.144.356q-.144.144-.356.144q-.213 0-.356-.144q-.144-.143-.144-.356z" />
</svg>`;

const exitFullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M7.423 20v-3.423H4v-1h4.423V20zm8.173 0v-4.423h4.423v1h-3.423V20zM4 8.423v-1h3.423V4h1v4.423zm11.596 0V4h1v3.423h3.423v1z" />
</svg>`;
