import React from "react";
import styles from "./index.module.css";
import {
  CopyierIconBlack,
  ClaimIcon
} from "@/app/sections/trends/components/top-traders/icons";
import RightArrowWrap from "@/app/sections/smart/components/RightArrowWrap";
import { useRouter } from "next/navigation";
import { SmartMoneyAddress, CopyTraderAddress } from "@/app/services/copyTrade";
import { numberFormatter, numberFormatterNew } from "@/app/utils/common";
import { useUserAgent } from "@/app/context/user-agent";

export default function CopyTradeCard(props: {
  smartMoniesInfo: SmartMoneyAddress | null;
  copyTradersUserInfo: CopyTraderAddress | null;
  useLinear?: boolean;
}) {
  const router = useRouter();
  const { smartMoniesInfo, copyTradersUserInfo, useLinear } = props;
  const { isMobile } = useUserAgent();
  const formatPnl = (pnl: string) => {
    if (pnl == '0') {
      return '0';
    }
    if (pnl.startsWith('-')) {
      return '-' + numberFormatterNew(Math.abs(Number(pnl)), 3, true);
    }
    return '+' + numberFormatterNew(pnl, 3, true);
}
  return (
    <div className={`
      ${isMobile ? styles.container : useLinear ? styles.linearContainer : styles.containerPC}
      ${!isMobile ? styles.fontWeight700 : ''}
    `.trim()}>
      <div className={styles.title}>
        <span>Copied PRFM</span>
        <div
          onClick={() => {
            router.push("/smartDetail");
          }}
          style={{cursor: 'pointer'}}
        >
          <RightArrowWrap useLinear={useLinear} />
        </div>
      </div>

      <div className={isMobile ? styles.copyDetails : styles.copyDetailsPC}>
        <div className={styles.totalPnl}>
          <span className={styles.detailTitle}>Total PnL</span>
          <span className={styles.detailValueContainer}>
            <span className={styles.detailValue}>
              {formatPnl(copyTradersUserInfo?.tradeInfo?.totalPNL || "0")}
            </span>
            <span className={styles.detailValueCurrency}>SOL</span>
          </span>
        </div>
        <div className={styles.openPosition}>
          <span className={styles.detailTitle}>Open Position</span>
          <span className={styles.detailValueContainer}>
            <span className={styles.detailValueCurrent}>
              {numberFormatter(
                copyTradersUserInfo?.tradeInfo?.currentPNL || 0,
                2,
                true
              ) || "0"}
            </span>
            <span className={styles.detailValue}>
              / {numberFormatter(copyTradersUserInfo?.tradeInfo?.tokenPosition || 0, 2, true)}
            </span>
            <span className={styles.detailValueCurrency}>SOL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
