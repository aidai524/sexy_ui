import {
  type ChartingLibraryWidgetOptions,
  type DatafeedConfiguration,
  type ResolutionString,
  type LibrarySymbolInfo
} from "@/public/libs/charting_library";
import dayjs from "@/app/utils/dayjs";
import {
  fetchData,
  fetchLastData,
  getGranularityByResolution
} from "../fetch-data";
import addPriceMarker from "./add-price-marker";

let lastPrice = 0;
let pullingQueryPriceTimer: any = null;
let kChartSubscriberList: Record<string, number> = {};
let currentSymbolInfo: SymbolInfo | null = null;
let savedHistoryCallback:
  | ((bars: any[], meta: { noData: boolean }) => void)
  | null = null;

interface SymbolInfo extends LibrarySymbolInfo {
  full_name: string;
}

const supported_resolutions = [
  "1",
  "5",
  "15",
  "30",
  "45",
  "1H",
  "2H",
  "3H",
  "4H",
  "1D",
  "1W",
  "1M"
] as ResolutionString[];

const configurationData: DatafeedConfiguration = {
  supported_resolutions,
  exchanges: [
    {
      value: "Trade",
      name: "Trade",
      desc: "Trade"
    }
  ],
  supports_marks: true,
  supports_timescale_marks: true
};

const datafeed: (
  address: string,
  tvWidgetRef: any,
  pageRef: any,
  hasNextRef: any,
  resolutionRef: any
) => ChartingLibraryWidgetOptions["datafeed"] = (
  address,
  tvWidgetRef,
  pageRef,
  hasNextRef,
  resolutionRef
) => ({
  onReady: (callback) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (userInput, onResultReadyCallback) => {},

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    const symbolInfo: any = {
      ticker: symbolName,
      name: symbolName,
      description: "",
      type: "stock",
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 10 ** 10,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions ?? [],
      volume_precision: 4,
      data_status: "streaming",
      full_name: symbolName,
      format: "price"
    };
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  },

  getBars: async (
    symbolInfo: SymbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    try {
      savedHistoryCallback = onHistoryCallback;

      if (resolution !== resolutionRef.current) {
        hasNextRef.current = true;
        pageRef.current = 0;
      }

      if (!hasNextRef.current) {
        onHistoryCallback([], { noData: true });
        return;
      }
      pageRef.current = pageRef.current + 1;

      const { data = [], hasNextPage } = await fetchData(
        address,
        getGranularityByResolution(resolution),
        pageRef.current
      );

      if (data?.length) lastPrice = data[data.length - 1][1];
      resolutionRef.current = resolution;
      hasNextRef.current = hasNextPage;
      resolutionRef.current = resolution;
      const bars = data?.map((item: any) => ({
        time: item[6],
        low: item[3],
        high: item[2],
        open: item[1],
        close: item[4],
        volume: item[5]
      }));
      if (!data || data?.length === 0) {
        onHistoryCallback([], { noData: true });
        return;
      }
      onHistoryCallback(bars, { noData: false });
    } catch (err: any) {
      console.error("getBars error", err);
      onHistoryCallback([], { noData: true });
      onErrorCallback(err);
    }
  },

  subscribeBars: (
    symbolInfo: SymbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberId,
    onResetCacheNeededCallback
  ) => {
    if (kChartSubscriberList[subscriberId]) return;

    kChartSubscriberList[subscriberId] = 1;
    currentSymbolInfo = symbolInfo;
    const fetchPrice = async () => {
      clearTimeout(pullingQueryPriceTimer);

      if (!currentSymbolInfo?.name) return;
      const item = await fetchLastData(address, resolution);
      if (!item?.[6]) {
        pullingQueryPriceTimer = setTimeout(fetchPrice, 5000);
        lastPrice = 0;
        return;
      }

      const bar = {
        time: item[6],
        low: item[3],
        high: item[2],
        open: item[1],
        close: item[4],
        volume: item[5]
      };

      if (!lastPrice && savedHistoryCallback) {
        savedHistoryCallback([bar], { noData: false });
      }

      addPriceMarker({ price: item[1], lastPrice, time: item[6], tvWidgetRef });

      onRealtimeCallback(bar);
      lastPrice = item[1];

      pullingQueryPriceTimer = setTimeout(fetchPrice, 5000);
    };
    clearTimeout(pullingQueryPriceTimer);
    pullingQueryPriceTimer = setTimeout(fetchPrice, 5000);
  },

  unsubscribeBars: (id) => {
    // console.log("unsubscribeBars", id);
    delete kChartSubscriberList[id];
    id === "custom" && clearTimeout(pullingQueryPriceTimer);
  }
});

export default datafeed;
