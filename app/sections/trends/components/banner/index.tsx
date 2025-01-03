import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useTrends } from "@/app/sections/trends/hooks";
import { numberFormatter } from "@/app/utils/common";
// import BuyModal from "@/app/sections/trends/components/buy";
import TradeModal from "@/app/components/trade-modal";
import { useTrade } from "@/app/sections/trends/hooks/trade";

const TrendBanner = (props: any) => {
  const { isMobile, onClose } = props;

  const { top1 } = useTrends({ isPolling: true });
  const { tradeToken, onTrade, setTradeToken } = useTrade();

  const [currentBg, setCurrentBg] = useState(
    isMobile ? BG_LIST_MOBILE[1] : BG_LIST[1]
  );
  const [currentBgIdx, setCurrentBgIdx] = useState(1);
  const [visible, setVisible] = useState(false);

  const handleBuy = () => {
    if (!top1) return;
    onTrade(top1);
    setVisible(true);
  };

  const handleBuyClose = () => {
    setVisible(false);
    setTradeToken({});
  };

  useEffect(() => {
    const setBg = () => {
      const _bgList = isMobile ? BG_LIST_MOBILE : BG_LIST;
      let _currentBgIdx = currentBgIdx + 1;
      if (_currentBgIdx > _bgList.length - 1) {
        _currentBgIdx = 0;
      }
      setCurrentBg(_bgList[_currentBgIdx]);
      setCurrentBgIdx(_currentBgIdx);
    };
    const timer = setInterval(setBg, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [currentBgIdx]);

  return (
    <div>
      <motion.div
        className={isMobile ? styles.ContainerMobile : styles.Container}
        initial={{ backgroundImage: isMobile ? BG_LIST_MOBILE[0] : BG_LIST[0] }}
        animate={{
          backgroundImage: currentBg
        }}
        transition={{
          duration: 3
        }}
      >
        <div
          className={styles.Avatar}
          style={{ backgroundImage: `url("${top1?.Icon}")` }}
        >
          <img
            src="/img/trends/crown-laptop.svg"
            alt=""
            className={styles.Crown}
          />
        </div>
        <div className={styles.Content}>
          <div className={styles.Title}>
            <div className={styles.Name}>{top1?.token_symbol}</div>
            {!isMobile && <div className={styles.Rank}>[KING OF THE HILL]</div>}
            {isMobile && (
              <div className={styles.TitleRight}>
                <BuyButton onBuy={handleBuy} />
                <button
                  type="button"
                  className={styles.CloseBtnMobile}
                  onClick={onClose}
                />
              </div>
            )}
          </div>
          {isMobile && <CreateTime top1={top1} />}
          <div className={styles.Summaries}>
            <div className={styles.Summary}>
              <div className={styles.SummaryLabel}>[Market Cap]</div>
              <div className={styles.SummaryValue}>
                {numberFormatter(top1?.market_cap, 2, true, {
                  prefix: "$",
                  isShort: true
                })}
              </div>
            </div>
            <div className={styles.Summary}>
              <div className={styles.SummaryLabel}>[Progress]</div>
              <div className={styles.SummaryValue}>{top1?.progress}%</div>
            </div>
            {!isMobile && <CreateTime top1={top1} />}
            {!isMobile && (
              <div className={styles.TradeContainer}>
                <BuyButton onBuy={handleBuy} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {/* <BuyModal
        visible={visible}
        tradeToken={tradeToken}
        onClose={handleBuyClose}
      /> */}
      {tradeToken && (
        <TradeModal
          show={visible}
          onClose={() => {
            handleBuyClose();
          }}
          data={tradeToken}
          initType={"buy"}
        />
      )}
    </div>
  );
};

export default TrendBanner;

const CreateTime = (props: any) => {
  const { top1 } = props;

  return (
    <div className={styles.Summary}>
      <div className={styles.SummaryValue}>
        Created in {top1?.created2Now?.replace?.(/ago$/, "")}
      </div>
    </div>
  );
};

const BuyButton = (props: any) => {
  const { onBuy } = props;

  return (
    <button type="button" className={styles.Trade} onClick={onBuy}>
      <img src="/img/trends/buy.svg" alt="" className={styles.TradeIcon} />
      <div className="">BUY</div>
    </button>
  );
};

const BG_LIST = [
  "linear-gradient(90deg, #5900FF 0%, rgba(255, 38, 129, 0.00) 100%)",
  "linear-gradient(90deg, #00E4A8 0%, rgba(255, 38, 129, 0.00) 100%)",
  "linear-gradient(90deg, #FB00FF 0%, rgba(255, 38, 129, 0.00) 100%)"
];
const BG_LIST_MOBILE = [
  "linear-gradient(359deg, #60F 0.75%, rgba(255, 38, 129, 0.70) 98.88%)",
  "linear-gradient(359deg, #0058E4 0.75%, rgba(255, 38, 129, 0.70) 98.88%)",
  "linear-gradient(359deg, #FB00FF 0.75%, rgba(255, 38, 129, 0.70) 98.88%)"
];
