import styles from "./index.module.css";
import Header from "./header";
import PanelWrapper from "./panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Holder from "@/app/components/holder";
import Txs from "@/app/sections/detail/components/txs";
import Trade from "@/app/components/trade";
import { useTokenPanelStatus } from "@/app/store/use-token-panel";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";

export default function TradePanel({ token, onClose }: any) {
  const tokenPanelStatusStore: any = useTokenPanelStatus();
  const mc = useMcWithPump(token);
  return (
    <div className={styles.Container}>
      <Header
        currentTab={tokenPanelStatusStore.tab}
        onChangeTab={tokenPanelStatusStore.setTab}
        onClose={onClose}
      />
      <div className={styles.Tabs}>
        {tokenPanelStatusStore.tab === "chart" && (
          <PanelWrapper>
            <Chart
              token={token}
              style={{
                padding: "10px",
                marginRight: "10px",
                borderRadius: "10px",
                height: "400px",
                position: "relative"
              }}
            />
          </PanelWrapper>
        )}
        {tokenPanelStatusStore.tab === "holders" && (
          <PanelWrapper>
            <Holder
              from="panel"
              showAvatar={false}
              hideBg={true}
              address={token.address}
            />
          </PanelWrapper>
        )}
        {tokenPanelStatusStore.tab === "transactions" && (
          <PanelWrapper>
            <Txs data={token} from="panel" />
          </PanelWrapper>
        )}
      </div>
      <Trade
        from="panel"
        initType="buy"
        token={token}
        show={true}
        onClose={onClose}
      />
    </div>
  );
}
