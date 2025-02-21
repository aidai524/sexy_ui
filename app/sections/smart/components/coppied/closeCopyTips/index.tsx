import React, { useState, useEffect, useMemo,useRef } from "react";
import styles from "./index.module.css";
import Modal from "@/app/components/modal";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useCopyTokenInfos } from "@/app/sections/profile/hooks/useCopyTokenInfos";
import { numberFormatter } from "@/app/utils/common";


export default function CloseCopyTips({ show, onClose, copiedInfo, handleCloseAndSell, handleClose }: any) {
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
        <div className={styles.titleText}>Close Copy Trade</div>
        <div className={styles.personInfo}>
            <img
                className={styles.avatar}
                src={copyUserInfo?.icon || defaultAvatar}
                alt=""
            />
            <div className={styles.userName}>
                @{formatAddress(copiedInfo?.from) || "FlipN"}
            </div>
        </div>
        <div className={styles.tipsText}>
        You’re going to close the copy trade, do you want to sell the tokens you copied?
        </div>
        
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

        <div className={styles.ButtonBox}>
            <div className={styles.SellButton + " " + styles.Button} onClick={() => {handleCloseAndSell(copiedInfo); onClose()}}>Close And Sell</div>
            <div className={styles.CloseButton + " " + styles.Button} onClick={() => {handleClose(copiedInfo); onClose()}}>Just Close</div>
        </div>
      </div>
    </Modal>
    );
  }
