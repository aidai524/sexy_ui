import LaunchesTradePanel from "./launches";
import PrelaunchTradePanel from "./prelaunch";

export default function TradePanel(props: any) {
  return props.token.status === 0 ? (
    <PrelaunchTradePanel {...props} />
  ) : (
    <LaunchesTradePanel {...props} />
  );
}
