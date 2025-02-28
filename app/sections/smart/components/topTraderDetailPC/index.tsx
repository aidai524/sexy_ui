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
import LeftArrowWrap from "../LeftArrowWrap";
import { useUser } from "@/app/store/useUser";
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress} from "@/app/utils";
import { useRouter, useSearchParams } from 'next/navigation';
import useUserInfo from '@/app/hooks/useUserInfo';
import CopyTrade from '@/app/services/copyTrade';
import { SmartMoneyAddress, CopyTraderAddress } from '@/app/services/copyTrade';
import StarGraph from '../StarGraphPC';
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import CoppiedModal from '@/app/sections/profile/components/coppiedActionPc';
import { numberFormatter } from '@/app/utils/common';
import { formatDateTime } from '@/app/utils/index';
import Big from 'big.js';
import { fecthUserInfo } from '@/app/utils/getUserInfo';
import TopTraderDetailShareConfirm from '@/app/sections/smart/components/topTraderDetailShareConfirm';
import { useAccount } from '@/app/hooks/useAccount';
import { useCopyTradeRefresh } from '@/app/store/useCopyTradeRefresh';

interface SatelliteNode {
  id: string;
  name: string;
  image: string;
  pnl: number;
}

export default function TopTraderDetailM() {
    const { address: walletAddress } = useAccount();
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
    const lastCopyTradeTime = useCopyTradeRefresh((state: any) => state.lastCopyTradeTime);
    
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
      const { data } = await CopyTradeService.getCopyTradersUserInfo({
        address,
        chain: "solana"
      });
      setCopyTradersUserInfo(data);
      console.log(data, "copyTradersUserInfo");
    }
  };
  useEffect(() => {
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

  // 
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
          console.log(userInfo, "userInfo");
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



  // to do release
  // if(copyTradersUserInfo && !copyTradersUserInfo.isTopTrader) {
  //   return (
  //     <div className={styles.notTopTraderContainer}>
  //       <span>You are not a top trader!</span>
  //       <div className={styles.notTopTraderBack} onClick={() => router.push('/')}>
  //         <div className={styles.notTopTraderBackBtn}>Go Back</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      <div onClick={() => router.back()}>
      <LeftArrowWrap />
       </div>
      
      {/* per */}
      <div className={styles.performanceAndGraph}>
      {/* charts */}
      <StarGraph centerNode={centerNode} satellites={satelliteNodes} />

      <div className={styles.performanceAndGraphRight}>
        {/* performance */}
        <div className={styles.performance}>
            {/*  */}
          <div className={styles.back}>
            
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
              <TopTraderCrown/>

            </div>
            <div onClick={() => setShowShareModal(true)}>
              <ShareIcon />
            </div>
          </div>
          <div className={styles.header}>
            <Performance />
          </div>
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <div className={styles.label}>1D PnL</div>
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
              <div className={styles.label}>7D PnL</div>
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
              <div className={styles.label}>30D PnL</div>
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
            </div> */}
             <div className={styles.gridItem}>
              <div className={styles.label}>Copy Traders</div>
              <div className={styles.amount}>
                <strong>{smartMoniesInfo?.copiers?.length || 0}</strong>
              </div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}>Copiers PnL</div>
              <div className={styles.amount}>
                <strong>{formatPnl(copyTradersUserInfo?.tradeInfo?.totalPNL || "0")}</strong>
                <span className={styles.unit}>&nbsp;SOL</span>
              </div>
            </div>

          </div>
          {/* <div className={styles.copierTokenList}>
              {copierImages.map((imageUrl, index) => (
                <img
                  key={"sate" + index}
                  className={styles.copierTokenImg}
                  alt="copier tokens"
                  src={imageUrl || defaultAvatar}
                />
              ))}
            </div> */}
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

    {SHOW_COPY_TRADE && (
              <CoppiedModal
                copiedInfo={currentUserInfo}
                show={showModal}
                address={address}
                onClose={() => {
                  setShowModal(false);
                  setRefreshNum(refreshNum + 1);
                }}
              />
            )}
      </div>
      </div>
      <TopTraderDetailShareConfirm  shareName={address} currentUserInfo={currentUserInfo} smartMoniesInfo={smartMoniesInfo} copyTradersUserInfo={copyTradersUserInfo} show={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}


export const TopTraderIconBold = ()=>{
  return (
    <svg width="82" height="16" viewBox="0 0 82 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="82" height="16" rx="8" fill="#C9FF5D" fill-opacity="0.3"/>
<g clip-path="url(#clip0_8859_15501)">
<path d="M15.5224 12.5474C15.5224 12.1759 15.2218 11.8753 14.8503 11.8753H7.14968C6.77816 11.8753 6.47752 12.1759 6.47752 12.5474C6.47752 12.919 6.77816 13.2196 7.14968 13.2196H14.8503C15.2218 13.2196 15.5224 12.9178 15.5224 12.5474ZM5.79924 7.10657C5.81024 7.10657 5.82002 7.10658 5.83102 7.10535L6.8967 10.9624H15.1032L16.1689 7.10535C16.1799 7.10535 16.1897 7.10657 16.2007 7.10657C16.6419 7.10657 17 6.74849 17 6.30731C17 5.86612 16.6419 5.50804 16.2007 5.50804C15.7595 5.50804 15.4014 5.86612 15.4014 6.30731C15.4014 6.39286 15.4149 6.47596 15.4405 6.55295L13.5133 7.67975L11.4418 4.24559C11.6569 4.10261 11.7999 3.85696 11.7999 3.57954C11.7999 3.13835 11.4418 2.78027 11.0006 2.78027C10.5594 2.78027 10.2013 3.13835 10.2013 3.57954C10.2013 3.85818 10.3431 4.10261 10.5594 4.24559L8.48793 7.67975L6.56065 6.55295C6.58509 6.47596 6.59975 6.39286 6.59975 6.30731C6.59975 5.86612 6.24167 5.50804 5.80049 5.50804C5.35808 5.50804 5 5.86612 5 6.30731C5 6.74849 5.35806 7.10657 5.79924 7.10657Z" fill="#C9FF5D"/>
</g>
<path d="M22.4713 6.728H24.1353V12H22.4713V6.728ZM20.1833 6H26.4233V7.472H20.1833V6ZM30.1919 12.128C29.4826 12.128 28.8586 11.9973 28.3199 11.736C27.7866 11.4747 27.3706 11.1093 27.0719 10.64C26.7786 10.1707 26.6319 9.624 26.6319 9C26.6319 8.376 26.7786 7.82933 27.0719 7.36C27.3706 6.89067 27.7866 6.52533 28.3199 6.264C28.8586 6.00267 29.4826 5.872 30.1919 5.872C30.9066 5.872 31.5306 6.00267 32.0639 6.264C32.5973 6.52533 33.0133 6.89067 33.3119 7.36C33.6106 7.82933 33.7599 8.376 33.7599 9C33.7599 9.624 33.6106 10.1707 33.3119 10.64C33.0133 11.1093 32.5973 11.4747 32.0639 11.736C31.5306 11.9973 30.9066 12.128 30.1919 12.128ZM30.1919 10.648C30.5813 10.648 30.9173 10.5813 31.1999 10.448C31.4826 10.3147 31.6986 10.1253 31.8479 9.88C32.0026 9.63467 32.0799 9.34133 32.0799 9C32.0799 8.65867 32.0026 8.36533 31.8479 8.12C31.6986 7.87467 31.4826 7.68533 31.1999 7.552C30.9173 7.41867 30.5813 7.352 30.1919 7.352C29.8079 7.352 29.4746 7.41867 29.1919 7.552C28.9093 7.68533 28.6906 7.87467 28.5359 8.12C28.3813 8.36533 28.3039 8.65867 28.3039 9C28.3039 9.34133 28.3813 9.63467 28.5359 9.88C28.6906 10.1253 28.9093 10.3147 29.1919 10.448C29.4746 10.5813 29.8079 10.648 30.1919 10.648ZM37.9827 6C38.484 6 38.916 6.08533 39.2787 6.256C39.6467 6.42667 39.9267 6.66933 40.1187 6.984C40.3107 7.29333 40.4067 7.656 40.4067 8.072C40.4067 8.48267 40.3107 8.84533 40.1187 9.16C39.9267 9.46933 39.6467 9.70933 39.2787 9.88C38.916 10.0507 38.484 10.136 37.9827 10.136H35.3827V8.808H37.8787C38.1454 8.808 38.3534 8.744 38.5027 8.616C38.652 8.48267 38.7267 8.30133 38.7267 8.072C38.7267 7.83733 38.652 7.656 38.5027 7.528C38.3534 7.39467 38.1454 7.328 37.8787 7.328H35.5267L36.2707 6.56V12H34.6147V6H37.9827ZM44.5025 6.728H46.1665V12H44.5025V6.728ZM42.2145 6H48.4545V7.472H42.2145V6ZM48.4508 7.432H50.1148L50.3868 9.064V12H48.7548V8.968L48.4508 7.432ZM52.5308 7.36V8.752C52.3708 8.72 52.2188 8.69867 52.0748 8.688C51.9361 8.672 51.8081 8.664 51.6908 8.664C51.4561 8.664 51.2401 8.712 51.0428 8.808C50.8454 8.89867 50.6854 9.05067 50.5628 9.264C50.4454 9.47733 50.3868 9.76267 50.3868 10.12L50.0748 9.736C50.1174 9.40533 50.1814 9.096 50.2668 8.808C50.3521 8.51467 50.4668 8.256 50.6108 8.032C50.7601 7.80267 50.9441 7.624 51.1628 7.496C51.3814 7.36267 51.6481 7.296 51.9628 7.296C52.0534 7.296 52.1468 7.30133 52.2428 7.312C52.3388 7.32267 52.4348 7.33867 52.5308 7.36ZM57.0994 12L56.8914 10.352L57.1074 9.72L56.8914 9.088L57.0994 7.432H58.7954L58.5074 9.712L58.7954 12H57.0994ZM57.4834 9.72C57.4088 10.2 57.2594 10.6213 57.0354 10.984C56.8168 11.3467 56.5368 11.6293 56.1954 11.832C55.8594 12.0293 55.4754 12.128 55.0434 12.128C54.5954 12.128 54.2008 12.0293 53.8594 11.832C53.5234 11.6293 53.2594 11.3467 53.0674 10.984C52.8754 10.616 52.7794 10.1947 52.7794 9.72C52.7794 9.23467 52.8754 8.81067 53.0674 8.448C53.2594 8.08533 53.5234 7.80267 53.8594 7.6C54.2008 7.39733 54.5954 7.296 55.0434 7.296C55.4754 7.296 55.8594 7.39733 56.1954 7.6C56.5368 7.79733 56.8194 8.07733 57.0434 8.44C57.2674 8.79733 57.4141 9.224 57.4834 9.72ZM54.4354 9.72C54.4354 9.944 54.4808 10.144 54.5714 10.32C54.6674 10.496 54.7981 10.6347 54.9634 10.736C55.1288 10.832 55.3181 10.88 55.5314 10.88C55.7554 10.88 55.9661 10.832 56.1634 10.736C56.3608 10.6347 56.5341 10.496 56.6834 10.32C56.8328 10.144 56.9448 9.944 57.0194 9.72C56.9448 9.49067 56.8328 9.288 56.6834 9.112C56.5341 8.936 56.3608 8.79733 56.1634 8.696C55.9661 8.59467 55.7554 8.544 55.5314 8.544C55.3181 8.544 55.1288 8.59467 54.9634 8.696C54.7981 8.79733 54.6674 8.936 54.5714 9.112C54.4808 9.288 54.4354 9.49067 54.4354 9.72ZM63.7096 12L63.4936 10.288L63.7736 9.728L63.5016 9.024L63.8856 5.84H65.5816L65.1096 9.592L65.3976 12H63.7096ZM64.0616 9.72C63.9869 10.2 63.8376 10.6213 63.6136 10.984C63.3949 11.3467 63.1149 11.6293 62.7736 11.832C62.4376 12.0293 62.0536 12.128 61.6216 12.128C61.1736 12.128 60.7789 12.0293 60.4376 11.832C60.1016 11.6293 59.8376 11.3467 59.6456 10.984C59.4536 10.616 59.3576 10.1947 59.3576 9.72C59.3576 9.23467 59.4536 8.81067 59.6456 8.448C59.8376 8.08533 60.1016 7.80267 60.4376 7.6C60.7789 7.39733 61.1736 7.296 61.6216 7.296C62.0536 7.296 62.4376 7.39733 62.7736 7.6C63.1149 7.79733 63.3976 8.07733 63.6216 8.44C63.8456 8.79733 63.9922 9.224 64.0616 9.72ZM61.0136 9.72C61.0136 9.944 61.0589 10.144 61.1496 10.32C61.2456 10.496 61.3762 10.6347 61.5416 10.736C61.7069 10.832 61.8962 10.88 62.1096 10.88C62.3336 10.88 62.5442 10.832 62.7416 10.736C62.9389 10.6347 63.1122 10.496 63.2616 10.32C63.4109 10.144 63.5229 9.944 63.5976 9.72C63.5229 9.49067 63.4109 9.288 63.2616 9.112C63.1122 8.936 62.9389 8.79733 62.7416 8.696C62.5442 8.59467 62.3336 8.544 62.1096 8.544C61.8962 8.544 61.7069 8.59467 61.5416 8.696C61.3762 8.79733 61.2456 8.936 61.1496 9.112C61.0589 9.288 61.0136 9.49067 61.0136 9.72ZM68.8233 12.128C68.2686 12.128 67.7726 12.0267 67.3353 11.824C66.9033 11.6213 66.562 11.3387 66.3113 10.976C66.0606 10.608 65.9353 10.1813 65.9353 9.696C65.9353 9.22133 66.0553 8.80533 66.2953 8.448C66.5353 8.08533 66.8633 7.80267 67.2793 7.6C67.7006 7.39733 68.1753 7.296 68.7033 7.296C69.2526 7.296 69.7193 7.416 70.1033 7.656C70.4926 7.89067 70.7913 8.224 70.9993 8.656C71.2126 9.088 71.3193 9.59733 71.3193 10.184H67.2553V9.2H70.3993L69.8633 9.544C69.842 9.30933 69.7833 9.112 69.6873 8.952C69.5913 8.78667 69.4633 8.66133 69.3033 8.576C69.1486 8.49067 68.962 8.448 68.7433 8.448C68.5033 8.448 68.298 8.496 68.1273 8.592C67.9566 8.688 67.8233 8.82133 67.7273 8.992C67.6313 9.15733 67.5833 9.352 67.5833 9.576C67.5833 9.864 67.6473 10.1093 67.7753 10.312C67.9086 10.5093 68.1006 10.6613 68.3513 10.768C68.6073 10.8747 68.9193 10.928 69.2873 10.928C69.6233 10.928 69.9566 10.8853 70.2873 10.8C70.6233 10.7093 70.9273 10.584 71.1993 10.424V11.464C70.8846 11.6773 70.5246 11.8427 70.1193 11.96C69.7193 12.072 69.2873 12.128 68.8233 12.128ZM71.7789 7.432H73.4429L73.7149 9.064V12H72.0829V8.968L71.7789 7.432ZM75.8589 7.36V8.752C75.6989 8.72 75.5469 8.69867 75.4029 8.688C75.2642 8.672 75.1362 8.664 75.0189 8.664C74.7842 8.664 74.5682 8.712 74.3709 8.808C74.1735 8.89867 74.0135 9.05067 73.8909 9.264C73.7735 9.47733 73.7149 9.76267 73.7149 10.12L73.4029 9.736C73.4455 9.40533 73.5095 9.096 73.5949 8.808C73.6802 8.51467 73.7949 8.256 73.9389 8.032C74.0882 7.80267 74.2722 7.624 74.4909 7.496C74.7095 7.36267 74.9762 7.296 75.2909 7.296C75.3815 7.296 75.4749 7.30133 75.5709 7.312C75.6669 7.32267 75.7629 7.33867 75.8589 7.36Z" fill="#C9FF5D"/>
<defs>
<clipPath id="clip0_8859_15501">
<rect width="12" height="12" fill="white" transform="translate(5 2)"/>
</clipPath>
</defs>
</svg>
  )
}