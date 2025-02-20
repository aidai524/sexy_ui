import React, { useState, useEffect, useMemo,useRef } from "react";
import styles from "./index.module.css";
import Modal from "@/app/components/modal";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useCopyTokenInfos } from "@/app/sections/profile/hooks/useCopyTokenInfos";
import { numberFormatter } from "@/app/utils/common";



export default function TokenGroup({ show, onClose, copiedInfo}: any) {
    const { userInfo: copyUserInfo } = useUserInfo(copiedInfo?.from);
    const tokensInfo = useCopyTokenInfos(copiedInfo?.tokens);

  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <div className={styles.main}>
        <div className={styles.titleText}>{tokensInfo?.length} Copied Tokens from @{formatAddress(copiedInfo?.from) || "FlipN"}</div>
        <div className={styles.CoppiedTokens}>
            <div className={styles.TokenIconBox}>
               {tokensInfo.map((tokenInfo:any, index:number) => {
                    return (
                      <div key={index} className={styles.TokenIcon}>
                        <div className={styles.TokenInfo}>
                          <img 
                              key={index} 
                              src={tokenInfo.icon || defaultAvatar} 
                              alt={tokenInfo.symbol || 'token'} 
                              title={tokenInfo.symbol || 'token'}
                          />
                          <div className={styles.TokenName}>{tokenInfo.symbol}</div>
                        </div>
                        <span className={styles.TokenBalance}>{numberFormatter(tokenInfo.balance, 4, true)}</span>
                      </div>
                    )
                })}
            </div>
        </div>
      </div>
    </Modal>
  );
}
