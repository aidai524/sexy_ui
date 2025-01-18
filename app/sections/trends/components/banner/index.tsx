import styles from "./index.module.css";
import { useState } from "react";
import { useTrends } from "@/app/sections/trends/hooks";
import { useRouter } from "next/navigation";
import { numberFormatter } from "@/app/utils/common";
import TradeModal from "@/app/components/trade-modal";
import { useTrade } from "@/app/sections/trends/hooks/trade";

const TrendBanner = (props: any) => {
  const { top1 } = useTrends({ isPolling: true });
  const { tradeToken, onTrade, setTradeToken } = useTrade();
  const router = useRouter();
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

  return (
    top1 && (
      <>
        <div className={styles.Container}>
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
          <div className={styles.Title}>
            <div className={styles.Name}>{top1?.token_symbol}</div>
            <div className={styles.Rank}>[KING OF THE HILL]</div>
          </div>
          <CreateTime top1={top1} />
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
            <button
              className={`${styles.ViewButton} button`}
              onClick={() => {
                router.push(`/detail?address=${top1?.address}&from=trends`);
              }}
            >
              View
            </button>
            <div className={styles.TradeContainer}>
              <BuyButton onBuy={handleBuy} />
            </div>
          </div>
        </div>

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
      </>
    )
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
