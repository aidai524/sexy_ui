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
import { numberFormatter } from "@/app/utils/common";
import ZeroFormat from "@/app/components/zeroFomat";

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
  onSuccess,
  isCurrent
}: any) {
  return (
    <div className={styles.Container}>
      <Header
        currentTab={tab}
        onChangeTab={setTab}
        onClose={onClose}
        tabs={TABS}
      />
      {isCurrent && (
        <>
          <div
            className={styles.Tabs}
            style={{
              height: 422,
              marginBottom: 0
            }}
          >
            {tab === "chart" && (
              <PanelWrapper>
                <div className={styles.DataWrapper}>
                  <div className={styles.DataItem} style={{ width: "50%" }}>
                    <div
                      className={styles.MarketCapWrapper}
                      style={{
                        color:
                          Number(token.market_cap_24h_usd) < 0
                            ? "#FF2681"
                            : "#C9FF5D"
                      }}
                    >
                      <div className={styles.MarketCap}>
                        $
                        {Number(token.mc) > 0
                          ? numberFormatter(token.mc, 2, true, {
                              isShort: true
                            })
                          : "-"}
                      </div>
                      <div className={styles.MarketCap24}>
                        {Number(token.marketCap24hUsd) > 0 ? "+" : "-"}$
                        {numberFormatter(token.marketCap24hUsd, 2, true, {
                          isShort: true
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DataItem} style={{ width: "25%" }}>
                    <div className={styles.DataLabel}>24h Volume</div>
                    <div className={styles.DataValue}>
                      {numberFormatter(token.volume_24h_usd, 2, true, {
                        isShort: true
                      })}
                    </div>
                  </div>
                  <div className={styles.DataItem} style={{ width: "25%" }}>
                    <div className={styles.DataLabel}>Current Price</div>
                    <div
                      className={styles.DataValue}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      $<ZeroFormat value={token.price} />
                    </div>
                  </div>
                </div>
                <Chart
                  token={token}
                  style={{
                    padding: "10px",
                    marginRight: "10px",
                    borderRadius: "10px",
                    height: 349,
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
              height: 237,
              position: "absolute",
              width: 574,
              bottom: 0
            }}
          >
            <Trade
              from="panel"
              initType="buy"
              token={token}
              show={true}
              onSuccess={() => {
                onSuccess(token, "trade");
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
