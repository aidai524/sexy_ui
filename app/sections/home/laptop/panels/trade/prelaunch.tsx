import styles from "./index.module.css";
import Header from "./header";
import PanelWrapper from "./panel-wrapper";
import Holder from "@/app/components/holder";
import PreUser from "@/app/components/thumbnail/preUser";
import Details from "../details";
import Comments from "../comments";
import FlipPanel from "../flip";
import Big from "big.js";

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
  showFlip = true,
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
          height: 492
        }}
      >
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
      {showFlip && (
        <div
          style={{
            marginTop: "-20px"
          }}
        >
          <FlipPanel
            token={token}
            onSuccess={(amount: string) => {
              token.isSuperLike = true;
              token.prePaid = token.prePaid + 1;
              token.total_amount = Number(token.total_amount) + Number(amount);
              token.prePaidAmount = Big(token.prePaidAmount || 0)
                .add(Number(amount) * 1e9)
                .toString();
              token.isLike = true;
              token.like = token.like + 1;
              onSuccess(token, "flip");
            }}
          />
        </div>
      )}
    </div>
  );
}
