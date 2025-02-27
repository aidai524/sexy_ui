import TotalPanel from "./total-panel";
import Others from "./others";
import Header from "./header";
import Panels from "./panels";
import styles from "./index.module.css";
import { useState } from "react";
import Rank from "./rank";
import InviteCodes from "../component/invite-codes";

export default function Mining({
  info,
  infoLoading,
  userInfo,
  rate,
  rateLoading,
  onCopyAll = () => {}
}: any) {
  const [showRank, setShowRank] = useState(false);
  const [showInviteCodes, setShowInviteCodes] = useState(false);

  return (
    <>
      <div className={styles.Container}>
        <Header
          rank={info?.your_rank}
          onRankClick={() => {
            setShowRank(true);
          }}
        />
        <div className={styles.Content}>
          <Panels
            onOpenInviteCodes={() => {
              setShowInviteCodes(true);
            }}
            rate={rate}
            onCopyAll={onCopyAll}
            info={info}
            userInfo={userInfo}
          />
          <TotalPanel info={info} userInfo={userInfo} />
          <Others info={info} />
        </div>
      </div>
      <Rank
        show={showRank}
        onClose={() => {
          setShowRank(false);
        }}
        info={info}
        userInfo={userInfo}
        infoLoading={infoLoading}
      />
      <InviteCodes
        show={showInviteCodes}
        onClose={() => {
          setShowInviteCodes(false);
        }}
      />
    </>
  );
}
