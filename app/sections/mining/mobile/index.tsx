import TotalPanel from "./total-panel";
import Others from "./others";
import Header from "./header";
import Panels from "./panels";
import styles from "./index.module.css";
import { useState } from "react";
import Rank from "./rank";

export default function Mining({
  info,
  infoLoading,
  userInfo,
  rate,
  rateLoading,
  onQuery
}: any) {
  const [showRank, setShowRank] = useState(false);

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
            rate={rate}
            info={info}
            userInfo={userInfo}
            onQuery={onQuery}
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
    </>
  );
}
