import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { numberFormatter } from "@/app/utils/common";
import FollowBtn from "../followBtn";
import CoppiedModal from "../coppiedModal";
import { SHOW_COPY_TRADE } from "@/app/utils/config";
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { useUserAgent } from "@/app/context/user-agent";
import Big from 'big.js';
import { Swiper } from 'antd-mobile'

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
  const getSmartMoniesInfo = async () => {
    const { data } = await CopyTradeService.getSmartMoniesAddress({address, chain: 'solana'});
    setSmartMoniesInfo(data);
  }

  const renderSummaryContent = (type: 'trade' | 'copied') => {
    const isTrade = type === 'trade';
    const data:any = isTrade ? smartMoniesInfo : copyTradersUserInfo?.tradeInfo;
    
    return (
      <div className={[styles.Inner, isTrade ? styles.GreenBg : styles.PurpleBg, !isMobile && styles.InnerPc].join(" ")}>
        <div className={isTrade ? styles.SummaryTitleTrade : styles.SummaryTitleCopied}>
          <span>{isTrade ? 'Trade PRFM' : 'Copied PRFM'}</span>
          {isTrade && isOther && (
            <button
              className={styles.CopyBtn}
              onClick={() => setShowModal(true)}
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              Copy Trade
            </button>
          )}
        </div>
        
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D PNL</div>
          <div className={[styles.SummaryValue, styles.SummaryValueBuy].join(" ")}>
            <span style={{color: !data?.pnl7D?.startsWith('-') ? '#C9FF5D' : '#FF5D5D'}}>
              {data?.pnl7D != '0' ? numberFormatter(data?.pnl7D, 4, true) + ' SOL' : '-'}
            </span>
          </div>
        </div>

        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>7D Win Rate</div>
          <div className={[styles.SummaryValue].join(" ")}>
            {data?.winRate7D && data?.winRate7D != '0' ? 
              numberFormatter(
                isTrade ? new Big(data.winRate7D).times(100) : data.winRate7D, 
                1, 
                true, 
                { isShort: true }
              ) : '-'}%
          </div>
        </div>

        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>Buy/Sell</div>
          <div className={[styles.SummaryValue].join(" ")}>
            <div className={[styles.SummaryValueBuy].join(" ")}>
              {isTrade ? 
                (data?.buys7D || '-') : 
                (data?.buys ? numberFormatter(data.buys, 0, true, { isShort: true }) : '-')}
            </div>
            <div className={[].join(" ")}>/</div>
            <div className={[styles.SummaryValueSell].join(" ")}>
              {isTrade ? 
                (data?.sells7D || '-') : 
                (data?.sells ? numberFormatter(data.sells, 0, true, { isShort: true }) : '-')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const items = [
    { title: "Trade PRFM", content: renderSummaryContent('trade') },
    { title: "Copied PRFM", content: renderSummaryContent('copied') }
  ];

  useEffect(() => {
    getCopyTradeDetails();
    getSmartMoniesInfo();
  }, [address]);
  

  return (
    <div className={isMobile ? styles.Container : styles.ContainerPc}>
      {/* PC */}
      {!isMobile && (
        <div className={styles.SummaryContainerPC}>
          {renderSummaryContent('trade')}
          {renderSummaryContent('copied')}
        </div>
      )}

      {/* Mobile */}
      {isMobile && (
        <Swiper
          style={{
            '--height': '116px',
            '--width': '100%',
            '--border-radius': '8px',
          }}
          defaultIndex={0}
          loop
          autoplay
          autoplayInterval={5000}
          indicator={false}
        >
          {items.map((item, index) => (
            <Swiper.Item key={index}>
              {item.content}
            </Swiper.Item>
          ))}
        </Swiper>
      )}

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
