import styles from "./index.module.css";
import Header from "./header";
import PanelWrapper from "./panel-wrapper";
import Holder from "@/app/components/holder";
import PreUser from "@/app/components/thumbnail/preUser";
import Trade from "@/app/components/trade";
import Details from "../details";
import Comments from "../comments";

const TABS = [
  {
    label: "Details",
    key: "details"
  },
  {
    label: "Discussion",
    key: "comments"
  },
  {
    label: "Flipped",
    key: "holders"
  }
];

export default function PrelaunchTradePanel({
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
      <div className={styles.Tabs}>
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
              onSuccess(token);
            }}
          />
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
