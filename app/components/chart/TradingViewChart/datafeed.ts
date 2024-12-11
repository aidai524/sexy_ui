import {
  type ChartingLibraryWidgetOptions,
  type DatafeedConfiguration,
  type ResolutionString,
  type LibrarySymbolInfo
} from "@/public/libs/charting_library";
import dayjs from "@/app/utils/dayjs";
import { fetchData } from "../fetch-data";

interface SymbolInfo extends LibrarySymbolInfo {
  full_name: string;
}

const supported_resolutions = [
  "1",
  "5",
  "15",
  "30",
  "1H",
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

const datafeed: ChartingLibraryWidgetOptions["datafeed"] = {
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
      exchange: "Trade",
      minmov: 1,
      pricescale: 10 ** 2,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions ?? [],
      volume_precision: 4,
      data_status: "streaming",
      full_name: symbolName,
      listed_exchange: "",
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
      const { from, to, firstDataRequest } = periodParams;
      console.log("83", firstDataRequest);
      let _from = from;
      if (resolution === "1D") {
        _from = dayjs().subtract(1, "month").startOf("day").valueOf() / 1000;
      } else if (resolution === "1W") {
        _from = dayjs().subtract(6, "week").startOf("week").valueOf() / 1000;
      } else if (resolution === "1M") {
        _from = dayjs().subtract(1, "year").startOf("month").valueOf() / 1000;
      }

      const data = await fetchData();
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
    const price = 4012;
    const bar = {
      time: Date.now(),
      low: price,
      high: price,
      open: price,
      close: price,
      volume: 0
    };
    onRealtimeCallback(bar);
  },

  unsubscribeBars: (id) => {
    // console.log("unsubscribeBars", id);
    // id === "custom" && clearInterval(pullingQueryPriceTimer);
  }
};

export default datafeed;
