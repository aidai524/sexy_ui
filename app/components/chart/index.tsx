import dynamic from "next/dynamic";
import Loading from "./Loading";
import {
  type TradingViewChartProps,
  type TradingViewChartExposes
} from "./TradingViewChart";
import { type Ref } from "react";

export const TradingViewChart = dynamic(
  async () => {
    const { default: TradingViewChart } = await import("./TradingViewChart");
    const wrapper = ({
      forwardedRef,
      ...props
    }: TradingViewChartProps & {
      forwardedRef: Ref<TradingViewChartExposes>;
    }) => <TradingViewChart ref={forwardedRef} {...props} />;
    return wrapper;
  },
  {
    ssr: false,
    loading: () => Loading()
  }
);
