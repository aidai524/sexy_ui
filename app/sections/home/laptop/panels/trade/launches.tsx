import styles from "./index.module.css";
import Header from "./header";
import PanelWrapper from "./panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Holder from "@/app/components/holder";
import PreUser from "@/app/components/thumbnail/preUser";
import Txs from "@/app/sections/detail/components/txs";
import Trade from "@/app/components/trade";
import Details from "../details";
import Comments from "../comments";

const TABS = [
  {
    label: "Charts",
    key: "chart"
  },
  {
    label: "Holders",
    key: "holders"
  },
  {
    label: "Txns",
    key: "transactions"
  },
  {
    label: "Details",
    key: "details"
  },
  {
    label: "Discussion",
    key: "comments"
  }
];

export default function LaunchesTradePanel({
  token,
  tab,
  setTab,
  onClose,
  onSuccess
}: any) {
  return (
    <div className={styles.Container}>
      <Header
        currentTab={tab}
        onChangeTab={setTab}
        onClose={onClose}
        tabs={TABS}
      />
      <div
        className={styles.Tabs}
        style={{
          height: 420
        }}
      >
        {tab === "chart" && (
          <PanelWrapper>
            <Chart
              token={token}
              style={{
                padding: "10px",
                marginRight: "10px",
                borderRadius: "10px",
                height: "380px",
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
        {tab === "details" && (
          <PanelWrapper>
            <Details token={token} from="detail" />
          </PanelWrapper>
        )}
        {tab === "comments" && (
          <Comments
            token={token}
            onSuccess={() => {
              token.comment = token.comment + 1;
              onSuccess(token, "comments");
            }}
          />
        )}
      </div>
      <div
        style={{
          marginTop: "-20px"
        }}
      >
        <Trade from="panel" initType="buy" token={token} show={true} />
      </div>
    </div>
  );
}
