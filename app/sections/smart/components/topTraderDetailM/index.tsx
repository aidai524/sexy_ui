import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.css";
import {
  LeftBackIcon,
  ShareIcon,
  CopyierIconWithBg,
  RightTopArrowIcon,
  TopTraderCrown,
  CopierTextIcon,
  Performance
} from "@/app/sections/trends/components/top-traders/icons";
import { useUser } from "@/app/store/useUser";
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress} from "@/app/utils";
import { useRouter, useSearchParams } from 'next/navigation';
import useUserInfo from '@/app/hooks/useUserInfo';
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import StarGraph from '../StarGraph';
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import CoppiedModal from '@/app/sections/profile/components/coppiedAction';
import { numberFormatter } from '@/app/utils/common';
import { formatDateTime } from '@/app/utils/index';
import Big from 'big.js';
import { fecthUserInfo } from '@/app/utils/getUserInfo';
import TopTraderDetailShareConfirm from '@/app/sections/smart/components/topTraderDetailShareConfirm';
import { useAccount } from '@/app/hooks/useAccount';
import { useCopyTradeRefresh } from '@/app/store/useCopyTradeRefresh';
import { Suspense } from "react";
import Loading from "@/app/loading";

interface SatelliteNode {
  id: string;
  name: string;
  image: string;
  pnl: number;
}

export default function TopTraderDetailM() {
    const { address: walletAddress } = useAccount();
    const lastCopyTradeTime = useCopyTradeRefresh((state: any) => state.lastCopyTradeTime);
    const { userInfo } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const address = searchParams.get('address');
    const isOther = address !== userInfo?.address && address !== walletAddress;
    const { userInfo: currentUserInfo } = useUserInfo(address || "");
    const CopyTradeService = new CopyTrade();
    const [smartMoniesInfo, setSmartMoniesInfo] = useState<SmartMoneyAddress | null>(null);
    const [copyTradersUserInfo, setCopyTradersUserInfo] = useState<CopyTraderAddress | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [refreshNum, setRefreshNum] = useState(0);
    const [copierImages, setCopierImages] = useState<string[]>([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [satelliteNodes, setSatelliteNodes] = useState<SatelliteNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const getUserInfoWithCache = useMemo(() => {
      const cache = new Map<string, any>();
      return async (address: string) => {
        if (cache.has(address)) {
          return cache.get(address);
        }
        const info = await fecthUserInfo(address);
        cache.set(address, info);
        return info;
      };
    }, []);

  useEffect(() => {
    const loadCopierImages = async () => {
      if (!smartMoniesInfo?.copiers?.length) return;

      const copierAddresses = smartMoniesInfo.copiers;
      const copierInfos = await Promise.all(
        copierAddresses.map((copier) => getUserInfoWithCache(copier))
      );

      const images = copierInfos.map((info) => info?.icon).filter(Boolean); // Remove any undefined/null values

      setCopierImages(images);
    };

    loadCopierImages();
  }, [smartMoniesInfo?.copiers, getUserInfoWithCache]);

  const getSmartMoniesInfo = async () => {
    if (address) {
      const { data } = await CopyTradeService.getSmartMoniesAddress({
        address,
        chain: "solana"
      });
      setSmartMoniesInfo(data);
      console.log(data, "smartMoniesInfo");
    }
  };
  const getCopyTradersUserInfo = async () => {
    if (address) {
      try {
        const { data } = await CopyTradeService.getCopyTradersUserInfo({
          address,
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
  }, [address, lastCopyTradeTime]);

  const formatPnl = (pnl: string) => {
    if (pnl == "0") {
      return "0";
    }
    if (pnl.startsWith("-")) {
      return "-" + numberFormatter(Math.abs(Number(pnl)), 2, true);
    }
    return "+" + numberFormatter(pnl, 2, true);
  };

  const formatWinRate = (winRate: string) => {
    if (winRate == "0") {
      return "0%";
    }
    return new Big(winRate).times(100).toFixed(1) + "%";
  };

  const isGtZero = (str: string) => {
    return Number(str) >= 0;
  };

  const getUserInfo: any = async (address: string) => {
    if (!address) return null;
    const userInfo = await fecthUserInfo(address);
    return userInfo;
  };

  const centerNode = useMemo(() => ({
    id: currentUserInfo?.address || "",
    name: currentUserInfo?.name || formatAddress(currentUserInfo?.address || ""),
    image: currentUserInfo?.icon || defaultAvatar
  }), [currentUserInfo?.address, currentUserInfo?.name, currentUserInfo?.icon]);

  useEffect(() => {
    const loadSatellites = async () => {
      if (!smartMoniesInfo?.topCopiers?.length) return;
      
      const nodes = await Promise.all(
        smartMoniesInfo.topCopiers.map(async (item: any) => {
          const userInfo = await getUserInfoWithCache(item.address);
          return {
            id: item.address,
            name: userInfo?.name || formatAddress(item.address || ""),
            image: userInfo?.icon || defaultAvatar,
            pnl: item.pnl
          };
        })
      );
      
      setSatelliteNodes(nodes);
    };

    loadSatellites();
  }, [smartMoniesInfo?.topCopiers, getUserInfoWithCache]);

  if (isLoading) {
    return <Loading />;
  }
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
            src={currentUserInfo?.icon || defaultAvatar}
            alt=""
          />
          <div className={styles.userName}>
            {formatAddress(
              currentUserInfo?.name ||
                currentUserInfo?.address ||
                address ||
                "FlipN"
            )}
          </div>
        </div>
        <div onClick={() => setShowShareModal(true)}>
          <ShareIcon />
        </div>
      </div>
      {/* charts */}
      <StarGraph centerNode={centerNode} satellites={satelliteNodes} />
      {/* performance */}
      <div className={styles.performance}>
        <div className={styles.header}>
          <Performance />
          <TopTraderCrown />
        </div>
        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <div className={styles.label}>1D PNL</div>
            <div className={styles.value}>
              <span className={isGtZero(smartMoniesInfo?.pnl1D || "0") ? styles.amount : styles.amountLessThanZero}>
                {formatPnl(smartMoniesInfo?.pnl1D || "0")}
              </span>
              <span className={styles.unit}>SOL</span>
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>1D Win Rate</div>
            <div className={styles.value}>
              {formatWinRate(smartMoniesInfo?.winRate1D || "0")}
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>7D PNL</div>
            <div className={styles.value}>
              <span className={isGtZero(smartMoniesInfo?.pnl7D || "0") ? styles.amount : styles.amountLessThanZero}>
                {formatPnl(smartMoniesInfo?.pnl7D || "0")}
              </span>
              <span className={styles.unit}>SOL</span>
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>7D Win Rate</div>
            <div className={styles.value}>
              {formatWinRate(smartMoniesInfo?.winRate7D || "0")}
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>30D PNL</div>
            <div className={styles.value}>
              <span className={isGtZero(smartMoniesInfo?.pnl30D || "0") ? styles.amount : styles.amountLessThanZero}>
                {formatPnl(smartMoniesInfo?.pnl30D || "0")}
              </span>
              <span className={styles.unit}>SOL</span>
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>30D Win Rate</div>
            <div className={styles.value}>
              {formatWinRate(smartMoniesInfo?.winRate30D || "0")}
            </div>
          </div>
        </div>
      </div>
      {/* buy sell */}
      <div className={styles.performance}>
        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <div className={styles.label}>Buy/sell</div>
            <div className={styles.value}>
              <span className={styles.amount}>
                {copyTradersUserInfo?.tradeInfo?.buys || 0}
              </span>
              <span>/</span>
              <span className={styles.sellAmount}>
                {copyTradersUserInfo?.tradeInfo?.sells || 0}
              </span>
            </div>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.label}>Last Trade</div>
            <div className={styles.value}>
              {formatDateTime(smartMoniesInfo?.lastTradeAt)}
            </div>
          </div>
        </div>
      </div>

      {/* copier */}
      <div className={styles.performance}>
        <div className={styles.header}>
          <CopierTextIcon />
        </div>
        <div className={styles.copierDetail}>
          {/* <div className={styles.copierAmount}>
            <CopyierIconWithBg />
            <span style={{ color: "#fff" }}>
              {smartMoniesInfo?.copiers?.length || 0}
            </span>
            <span>
              <RightTopArrowIcon />
              <span style={{ marginLeft: "4px" }}>
                {smartMoniesInfo?.newCopiers?.length || 0}
              </span>
            </span>
          </div>
          <div>
            {copierImages.map((imageUrl, index) => (
              <img
                key={"sate" + index}
                className={styles.copierTokenImg}
                alt="copier tokens"
                src={imageUrl || defaultAvatar}
              />
            ))}
          </div> */}
           <div className={styles.gridItem}>
              <div className={styles.label}>Copy Traders</div>
              <div className={styles.amount}>
                {smartMoniesInfo?.copiers?.length || 0}
              </div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}>Copiers Pnl</div>
              <div className={styles.amount}>
                {formatPnl(copyTradersUserInfo?.tradeInfo?.totalPNL || "0")}
                <span className={styles.unit}>&nbsp;SOL</span>
              </div>
            </div>

          {SHOW_COPY_TRADE && (
            <CoppiedModal
              copiedInfo={currentUserInfo}
              address={address}
              show={showModal}
              onClose={() => {
                setShowModal(false);
                setRefreshNum(refreshNum + 1);
              }}
            />
          )}
        </div>
    </div>
    
     {/* button */}
     {isOther && (
        <div className={styles.btnGroup}>
          <div
            className={styles.btnProfile}
            onClick={() => {
              router.push("/profile/user?account=" + address + "&from=detail");
            }}
          >
            Profile
          </div>
          <div
            className={styles.btnCopyTrade}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Copy Trade
          </div>
        </div>
      )}

      <TopTraderDetailShareConfirm shareName={address} currentUserInfo={currentUserInfo} smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo} show={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}
