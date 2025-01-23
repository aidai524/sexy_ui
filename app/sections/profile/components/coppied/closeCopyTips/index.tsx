import React, { useState, useEffect, useMemo,useRef } from "react";
import styles from "./index.module.css";
import Modal from "@/app/components/modal";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import useUserInfo from "@/app/hooks/useUserInfo";
import { getTokenMeta } from "@/app/utils/solanaScanApi";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";



export default function CloseCopyTips({ show, onClose, copiedInfo, handleCloseAndSell, handleClose }: any) {
    const { userInfo: copyUserInfo } = useUserInfo(copiedInfo?.from);
    console.log(copiedInfo)
    console.log(copyUserInfo)

    const [tokensInfo, setTokensInfo] = useState<any[]>([]);
    const { connection } = useConnection();

    useEffect(() => {
        const loadTokensInfo = async () => {
            if (!copiedInfo?.tokens) return;
            
            const tokenInfoPromises = copiedInfo.tokens.slice(0, 5).map((item: any) => 
                getTokenInfo(item.token)
            );
            const results = await Promise.all(tokenInfoPromises);
            setTokensInfo(results);
        };

        loadTokensInfo();
    }, [copiedInfo?.tokens]);

    const getTokenInfo = async (address: string) => {
        try {
            if (process.env.NEXT_PUBLIC_NET === "Devnet") {
                const tokenSupply = await connection.getTokenSupply(
                    new PublicKey(address),
                    "confirmed"
                );
                return {
                    supply: tokenSupply.value.uiAmount || 0,
                    icon: defaultAvatar,
                    symbol: 'token'
                };
            } else {
                const tokenInfo = await getTokenMeta(address);
                return {
                    supply: tokenInfo.data.supply,
                    icon: tokenInfo.data.icon || defaultAvatar,
                    symbol: tokenInfo.data.symbol || 'token'
                };
            }
        } catch (error) {
            return {
                supply: 0,
                icon: defaultAvatar,
                symbol: 'token'
            };
        }
    };
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
            <div className={styles.TitlePubStyle}>Coppied Tokens</div>
            <div className={styles.TokenIconBox}>
               {tokensInfo.map((tokenInfo, index) => {
                    if (index === 4) {
                        return <div key={index} className={styles.MoreTokens}>...</div>
                    }
                    if (index < 4) {
                        return <img 
                            key={index} 
                            src={tokenInfo.icon || defaultAvatar} 
                            alt={tokenInfo.symbol || 'token'} 
                            title={tokenInfo.symbol || 'token'}
                        />
                    }
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
