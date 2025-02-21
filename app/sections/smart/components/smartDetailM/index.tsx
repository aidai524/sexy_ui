import React from "react";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import {
  LeftBackIcon,
  ShareIcon
} from "@/app/sections/trends/components/top-traders/icons";
import { useUser } from "@/app/store/useUser";
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress } from "@/app/utils";
import { formatLongText } from "@/app/utils/common";
import { useUserAgent } from "@/app/context/user-agent";
import { useRouter } from "next/navigation";
import Coppied from "@/app/sections/smart/components/coppied";
import { useSearchParams } from "next/navigation";
import useUserInfo from "@/app/hooks/useUserInfo";
import CopyTrade from "@/app/services/copyTrade";
import { SmartMoneyAddress, CopyTraderAddress } from "@/app/services/copyTrade";
import { numberFormatter } from "@/app/utils/common";
export default function SmartDetailM() {
  const { userInfo } = useUser();
  const currentAddress = userInfo?.address;
  const { isMobile } = useUserAgent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const isOther = address !== currentAddress && address;
  const { userInfo: currentUserInfo } = useUserInfo(address || "");
  const CopyTradeService = new CopyTrade();
  const [smartMoniesInfo, setSmartMoniesInfo] =
    useState<SmartMoneyAddress | null>(null);
  const [copyTradersUserInfo, setCopyTradersUserInfo] =
    useState<CopyTraderAddress | null>(null);

  const reqAddress = isOther ? address : currentAddress;
  const getSmartMoniesInfo = async () => {
    if (reqAddress) {
      const { data } = await CopyTradeService.getSmartMoniesAddress({
        address: reqAddress,
        chain: "solana"
      });
      setSmartMoniesInfo(data);
      console.log(data, "smartMoniesInfo");
    }
  };
  const getCopyTradersUserInfo = async () => {
    if (reqAddress) {
      const { data } = await CopyTradeService.getCopyTradersUserInfo({
        address: reqAddress,
        chain: "solana"
      });
      setCopyTradersUserInfo(data);
      console.log(data, "copyTradersUserInfo");
    }
  };
  useEffect(() => {
    getSmartMoniesInfo();
    getCopyTradersUserInfo();
  }, [reqAddress]);

  return (
    <div className={styles.container}>
      {/*  */}
      <div className={styles.back}>
        <div onClick={() => router.back()}>
          <LeftBackIcon />
        </div>
        <div className={styles.userInfo}>
          <img
            className={styles.avatar}
            src={userInfo?.icon || defaultAvatar}
            alt=""
          />
          <div className={styles.userName}>
            {formatLongText(userInfo?.name) ||
              formatAddress(userInfo?.address) ||
              "FlipN"}
          </div>
        </div>
        <div>
          <ShareIcon />
        </div>
      </div>
      {/*  */}
      <SmartDetailContent copyTradersUserInfo={copyTradersUserInfo || null} />
      {/* copy list */}
      <Coppied isOther={false} />
    </div>
  );
}

export const SmartDetailContent = ({
  copyTradersUserInfo
}: {
  copyTradersUserInfo: CopyTraderAddress | null;
}) => {
  const formatPnl = (pnl: string) => {
    if (pnl == "0") {
      return "0";
    }
    if (pnl.startsWith("-")) {
      return "-" + numberFormatter(Math.abs(Number(pnl)), 4, true);
    }
    return "+" + numberFormatter(pnl, 4, true);
  };
  const isGtZero = (str: string) => {
    return Number(str) > 0;
  };
  return (
    <div className={styles.smartDetailContent}>
      <h3 className={styles.smartDetailContentTitle}>Copied PRFM</h3>
      <div className={styles.statsContainer}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Total PnL</div>
            <div className={styles.statValueBig}>
              <span
                className={
                  isGtZero(copyTradersUserInfo?.tradeInfo?.totalPNL || "0")
                    ? styles.highlight
                    : styles.shortlight
                }
              >
                {formatPnl(copyTradersUserInfo?.tradeInfo?.totalPNL || "0")}
              </span>
              <span className={styles.detailValueCurrency}>SOL</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>ROI</div>
            <div className={styles.statValue}>
              {+(copyTradersUserInfo?.tradeInfo?.roi || 0) * 100}%
            </div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Copy Trade Count</div>
            <div className={styles.statValue}>
              {copyTradersUserInfo?.copyTrades || 0}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Win Rate</div>
            <div className={styles.statValue}>
              {+(copyTradersUserInfo?.tradeInfo?.winRate || 0) * 100}%
            </div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Open Position</div>
            <div className={styles.statValue}>
              {numberFormatter(
                copyTradersUserInfo?.tradeInfo?.tokenPosition,
                2,
                true
              )}{" "}
              SOL
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Current PnL</div>
            <div className={styles.statValue}>
              <span className={styles.highlight}>
                {numberFormatter(
                  copyTradersUserInfo?.tradeInfo?.currentPNL,
                  2,
                  true
                )}
              </span>
              <span className={styles.detailValueCurrency}>SOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
