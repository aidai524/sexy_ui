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
import useUserInfo from '@/app/hooks/useUserInfo';
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import { numberFormatter, numberFormatterNew } from '@/app/utils/common';
import CopyTradeShare from '@/app/sections/smart/components/CopyTraderShare/modal';
import { useAccount } from "@/app/hooks/useAccount";
import Big from 'big.js';
import Loading from "@/app/loading";
import { useCloseCopy } from "@/app/store/useCloseCopy";

export default function SmartDetailM() {
  const { userInfo } = useUser();
  const { lastCloseCopyTime, set: setLastCloseCopyTime }:any = useCloseCopy();
  const { address: walletAddress } = useAccount();
  const currentAddress = userInfo?.address || walletAddress;
  const { isMobile } = useUserAgent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const referrer = searchParams.get("referrer");
  const isOther = address !== currentAddress && address;
  const { userInfo: currentUserInfo } = useUserInfo(address || "");
  const CopyTradeService = new CopyTrade();
  const [smartMoniesInfo, setSmartMoniesInfo] =
    useState<SmartMoneyAddress | null>(null);
  const [copyTradersUserInfo, setCopyTradersUserInfo] =
    useState<CopyTraderAddress | null>(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      try {
        const { data } = await CopyTradeService.getCopyTradersUserInfo({
          address: reqAddress,
          chain: "solana"
      });
      setCopyTradersUserInfo(data);
      console.log(data, "copyTradersUserInfo");
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getSmartMoniesInfo();
    getCopyTradersUserInfo();
  }, [reqAddress]);

  // refresh
  useEffect(() => {
    getSmartMoniesInfo();
    getCopyTradersUserInfo();
  }, [lastCloseCopyTime]);


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {/*  */}
      <div className={styles.back}>
        <div
          onClick={() => {
            if (referrer === "copy-trader-share") {
              router.push("/");
            } else {
              router.back();
            }
          }}
        >
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
              formatAddress(userInfo?.address || walletAddress) ||
              "FlipN"}
          </div>
        </div>
        <div onClick={() => setShareVisible(true)}>
          <ShareIcon />
        </div>
      </div>
      <div style={{height: '50px'}}></div>
      {/*  */}
      <SmartDetailContent copyTradersUserInfo={copyTradersUserInfo || null} />
      {/* copy list */}
      <Coppied isOther={false} />
      <CopyTradeShare
        copyTradersUserInfo={copyTradersUserInfo || null}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
      />
    </div>
  );
}

// Move helper functions outside the component
const formatPnl = (pnl: string) => {
  if (pnl == "0") {
    return "0";
  }
  if (pnl.startsWith("-")) {
    return "-" + numberFormatterNew(Math.abs(Number(pnl)), 3, true);
  }
  return "+" + numberFormatterNew(pnl, 3, true);
};

const isGtZero = (str: string) => {
  return Number(str) > 0;
};

const formatWinRate = (winRate: string) => {
  if (winRate == '0') {
    return '0%';
  }
  return new Big(winRate).times(100).toFixed(1) + '%';
};

export const SmartDetailContent = ({
  copyTradersUserInfo
}: {
  copyTradersUserInfo: CopyTraderAddress | null;
}) => {
  return (
    <div className={styles.smartDetailContent}>
      <h3 className={styles.smartDetailContentTitle}>Copied PRFM</h3>
      <div className={styles.statsContainer}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Total PNL</div>
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
              {formatWinRate(copyTradersUserInfo?.tradeInfo?.roi || "0")}
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
              {formatWinRate(copyTradersUserInfo?.tradeInfo?.winRate || "0")}
            </div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Open Position</div>
            <div className={styles.statValue}>
              {formatPnl(copyTradersUserInfo?.tradeInfo?.tokenPosition || "0")}
              &nbsp;SOL
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Current PNL</div>
            <div className={styles.statValue}>
              <span className={isGtZero(copyTradersUserInfo?.tradeInfo?.currentPNL || "0") ? styles.highlight : styles.shortlight}>
                {formatPnl(copyTradersUserInfo?.tradeInfo?.currentPNL || "0")}
              </span>
              <span className={styles.detailValueCurrency}>SOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
