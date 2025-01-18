import styles from "./index.module.css";
import Header from "./header";
import PanelWrapper from "./panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Holder from "@/app/components/holder";
import PreUser from "@/app/components/thumbnail/preUser";
import Txs from "@/app/sections/detail/components/txs";
import Trade from "@/app/components/trade";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";

export default function TradePanel({ token, tab, setTab, onClose }: any) {
  const mc = useMcWithPump(token);
  return (
    <div className={styles.Container}>
      <Header currentTab={tab} onChangeTab={setTab} onClose={onClose} />
      <div className={styles.Tabs}>
        {tab === "chart" && (
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
        {tab === "holders" && (
          <PanelWrapper>
            {token.status === 0 ? (
              <PreUser token={token} from="panel" />
            ) : (
              <Holder
                showAvatar={false}
                hideBg={true}
                address={token.address}
                from="panel"
              />
            )}
          </PanelWrapper>
        )}
        {tab === "transactions" && (
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
