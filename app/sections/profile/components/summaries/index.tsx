import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import FollowBtn from "../followBtn";
import CoppiedModal from "../coppiedModal";
import { SHOW_COPY_TRADE } from "@/app/utils/config";
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress } from '@/app/services/copyTrade';
import { useUserAgent } from "@/app/context/user-agent";
const Summaries = (props: any) => {
  const { isMobile } = useUserAgent();
  const CopyTradeService = new CopyTrade();
  const { address, isFollower, setRefreshNum, refreshNum, userInfo, isOther } = props;
  const [showModal, setShowModal] = useState(false);
  const [smartMoniesInfo, setSmartMoniesInfo] = useState<SmartMoneyAddress | null>(null);

  const getCopyTradeDetails = async () => {
    const { data } = await CopyTradeService.getSmartMoniesAddress({address, chain: 'solana'});
    setSmartMoniesInfo(data);
  }

  useEffect(() => {
    getCopyTradeDetails();
  }, [address]);

  return (
    <div className={isMobile ? styles.Container : styles.ContainerPc}>
       {!isMobile && isOther && (
        <div className={styles.BtnGroupPc}>
          <div></div>
          <div></div>
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
      )}
      <div className={isMobile ? styles.Inner : styles.InnerPc}>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D PNL</div>
          <div
            className={[styles.SummaryValue, styles.SummaryValueBuy].join(" ")}
          >
            +{numberFormatter(smartMoniesInfo?.pnl7D, 2, true, { prefix: "$", isShort: true })}
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D Win Rate</div>
          <div className={[styles.SummaryValue].join(" ")}>
            {numberFormatter(smartMoniesInfo?.winRate7D, 1, true, { isShort: true })}%
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>Buy/Sell</div>
          <div className={[styles.SummaryValue].join(" ")}>
            <div className={[styles.SummaryValueBuy].join(" ")}>
              {numberFormatter(smartMoniesInfo?.buys7D, 0, true, { isShort: true })}
            </div>
            <div className={[].join(" ")}>/</div>
            <div className={[styles.SummaryValueSell].join(" ")}>
              {numberFormatter(smartMoniesInfo?.sells7D, 0, true, { isShort: true })}
            </div>
          </div>
        </div>
      </div>
      {isMobile && isOther && (
        <div className={styles.BtnGroup}>
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
      )}
      {SHOW_COPY_TRADE && (
        <CoppiedModal
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
