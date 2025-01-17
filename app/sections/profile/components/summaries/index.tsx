import { useState } from "react";
import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import FollowBtn from "../followBtn";
import CoppiedAction from "../coppiedAction";
import { SHOW_COPY_TRADE } from "@/app/utils/config";

const Summaries = (props: any) => {
  const { address, isFollower, setRefreshNum, refreshNum, userInfo } = props;
  const [showModal, setShowModal] = useState(false);
  console.log("userInfo", userInfo);

  return (
    <div className={styles.Container}>
      <div className={styles.Inner}>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D PNL</div>
          <div
            className={[styles.SummaryValue, styles.SummaryValueBuy].join(" ")}
          >
            +{numberFormatter(364.158, 2, true, { prefix: "$", isShort: true })}
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D Win Rate</div>
          <div className={[styles.SummaryValue].join(" ")}>
            {numberFormatter(450.58, 1, true, { isShort: true })}%
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>Buy/Sell</div>
          <div className={[styles.SummaryValue].join(" ")}>
            <div className={[styles.SummaryValueBuy].join(" ")}>
              {numberFormatter(40, 0, true, { isShort: true })}
            </div>
            <div className={[].join(" ")}>/</div>
            <div className={[styles.SummaryValueSell].join(" ")}>
              {numberFormatter(22, 0, true, { isShort: true })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.BtnGroup}>
        {/* <button className={styles.FollowBtn}>Follow</button> */}
        <FollowBtn
          useAnotherClassName={true}
          address={address}
          isFollower={isFollower}
          onSuccess={() => {
            setRefreshNum(refreshNum + 1);
          }}
        />

        <button
          className={styles.CopyBtn}
          onClick={() => {
            setShowModal(true);
          }}
        >
          Copy Trade
        </button>
      </div>
      {SHOW_COPY_TRADE && (
        <CoppiedAction
          copiedInfo={userInfo}
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Summaries;
