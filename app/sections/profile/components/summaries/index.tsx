import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import FollowBtn from "../followBtn";
import CoppiedModal from "../coppiedModal";
import { SHOW_COPY_TRADE } from "@/app/utils/config";
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { useUserAgent } from "@/app/context/user-agent";
const Summaries = (props: any) => {
  const { isMobile } = useUserAgent();
  const CopyTradeService = new CopyTrade();
  const { address, isFollower, setRefreshNum, refreshNum, userInfo, isOther } = props;
  const [showModal, setShowModal] = useState(false);
  const [smartMoniesInfo, setSmartMoniesInfo] = useState<SmartMoneyAddress | null>(null);
  const [copyTradersUserInfo, setCopyTradersUserInfo] = useState<CopyTraderAddress | null>(null);
  const getCopyTradeDetails = async () => {
    const { data } = await CopyTradeService.getCopyTradersUserInfo({address, chain: 'solana'});
    setCopyTradersUserInfo(data);
  }

  useEffect(() => {
    getCopyTradeDetails();
  }, [address]);

  return (
    <div className={isMobile ? styles.Container : styles.ContainerPc}>
      
      {/* PC */}
      <div className={styles.SummaryContainerPC}>
        <div className={styles.InnerPc}>

          {isOther &&  (

            <button
              className={styles.CopyBtn}
              onClick={() => {
                setShowModal(true);
              }}
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              Copy Trade
              </button>
          )}
          <div className={styles.Summary}>
            <div className={styles.SummaryLabel}>7D PNL</div>
            <div
              className={[styles.SummaryValue, styles.SummaryValueBuy].join(" ")}
            >
              <span style={{color: !copyTradersUserInfo?.tradeInfo?.pnl7D.startsWith('-') ? '#C9FF5D' : '#FF5D5D'}}>{ copyTradersUserInfo?.tradeInfo?.pnl7D != '0' ? numberFormatter(copyTradersUserInfo?.tradeInfo?.pnl7D, 4, true) + ' SOL' : '-'}</span>
            </div>
          </div>
          <div className={styles.Summary}>
            <div className={styles.SummaryLabel}>7D Win Rate</div>
            <div className={[styles.SummaryValue].join(" ")}>
              { copyTradersUserInfo?.tradeInfo?.winRate7D ? numberFormatter(copyTradersUserInfo?.tradeInfo?.winRate7D, 1, true, { isShort: true }) : '-'}%
            </div>
          </div>
          <div className={styles.Summary}>
            <div className={styles.SummaryLabel}>Buy/Sell</div>
            <div className={[styles.SummaryValue].join(" ")}>
              <div className={[styles.SummaryValueBuy].join(" ")}>
                {copyTradersUserInfo?.tradeInfo?.buys ? numberFormatter(copyTradersUserInfo?.tradeInfo?.buys, 0, true, { isShort: true }) : '-'}
              </div>
              <div className={[].join(" ")}>/</div>
              <div className={[styles.SummaryValueSell].join(" ")}>
                {copyTradersUserInfo?.tradeInfo?.sells ? numberFormatter(copyTradersUserInfo?.tradeInfo?.sells, 0, true, { isShort: true }) : '-'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.InnerPc}>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D PNL</div>
          <div
            className={[styles.SummaryValue, styles.SummaryValueBuy].join(" ")}
          >
            <span style={{color: !copyTradersUserInfo?.tradeInfo?.pnl7D.startsWith('-') ? '#C9FF5D' : '#FF5D5D'}}>{ copyTradersUserInfo?.tradeInfo?.pnl7D != '0' ? numberFormatter(copyTradersUserInfo?.tradeInfo?.pnl7D, 4, true) + ' SOL' : '-'}</span>
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D Win Rate</div>
          <div className={[styles.SummaryValue].join(" ")}>
            { copyTradersUserInfo?.tradeInfo?.winRate7D ? numberFormatter(copyTradersUserInfo?.tradeInfo?.winRate7D, 1, true, { isShort: true }) : '-'}%
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>Buy/Sell</div>
          <div className={[styles.SummaryValue].join(" ")}>
            <div className={[styles.SummaryValueBuy].join(" ")}>
              {copyTradersUserInfo?.tradeInfo?.buys ? numberFormatter(copyTradersUserInfo?.tradeInfo?.buys, 0, true, { isShort: true }) : '-'}
            </div>
            <div className={[].join(" ")}>/</div>
            <div className={[styles.SummaryValueSell].join(" ")}>
              {copyTradersUserInfo?.tradeInfo?.sells ? numberFormatter(copyTradersUserInfo?.tradeInfo?.sells, 0, true, { isShort: true }) : '-'}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* mobile */}
     


      {SHOW_COPY_TRADE && (
        <CoppiedModal
          copiedInfo={userInfo}
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setRefreshNum(refreshNum + 1);
          }}
        />
      )}
    </div>
  );
};

export default Summaries;
