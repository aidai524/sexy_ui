import {
  type ChartingLibraryWidgetOptions,
  type DatafeedConfiguration,
  type ResolutionString,
  type LibrarySymbolInfo
} from "@/public/libs/charting_library";
import dayjs from "@/app/utils/dayjs";
import { fetchData, fetchLastData } from "../fetch-data";

let page = 0;
let hasNext = true;
let pullingQueryPriceTimer: any = null;
let kChartSubscriberList: Record<string, number> = {};
let currentSymbolInfo: SymbolInfo | null = null;

interface SymbolInfo extends LibrarySymbolInfo {
  full_name: string;
}

const supported_resolutions = [
  "1",
  "5"
  // "15",
  // "30",
  // "1H",
  // "1D",
  // "1W",
  // "1M"
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
  address: string
) => ChartingLibraryWidgetOptions["datafeed"] = (address) => ({
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
      pricescale: 10 ** 8,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions ?? [],
      volume_precision: 4,
      data_status: "streaming",
      full_name: symbolName,
      format: "price",
      has_empty_bars: true
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
      if (!hasNext) {
        onHistoryCallback([], { noData: true });
        return;
      }
      page++;
      const { data, hasNextPage } = await fetchData(address, resolution, page);
      hasNext = hasNextPage;
      const bars = data.map((item: any) => ({
        time: item[6],
        low: item[3],
        high: item[2],
        open: item[1],
        close: item[4],
        volume: item[5]
      }));
      if (data.length === 0) {
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
      if (!item) return;
      const bar = {
        time: item[0],
        low: item[3],
        high: item[2],
        open: item[1],
        close: item[4],
        volume: item[5]
      };

      onRealtimeCallback(bar);
      pullingQueryPriceTimer = setTimeout(fetchPrice, 3000);
    };
    clearTimeout(pullingQueryPriceTimer);
    pullingQueryPriceTimer = setTimeout(fetchPrice, 3000);
  },

  unsubscribeBars: (id) => {
    // console.log("unsubscribeBars", id);
    delete kChartSubscriberList[id];
    id === "custom" && clearTimeout(pullingQueryPriceTimer);
  }
});

export default datafeed;
