import styles from "./index.module.css";
import CopyTrade from '@/app/services/copyTrade'
import React,{ useState, useEffect } from 'react';
import { SHOW_COPY_TRADE } from '@/app/utils/config';


export default function FollowerActions({ userInfo, style, onItemClick }: any) {
  const CopyTradeService = new CopyTrade();
  const [copyTradersUserInfo, setCopyTradersUserInfo] = useState<any>(null);
  const getCopyTradeDetails = async () => {
    const { data } = await CopyTradeService.getCopyTradersUserInfo({address: userInfo?.address, chain: 'solana'});
    setCopyTradersUserInfo(data);
  }

  useEffect(() => {
    getCopyTradeDetails();
  }, [userInfo?.address]);

  return (
    <div className={styles.follwerActions} style={style}>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("followers");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.followers || 0}</span>
        <span>Followers</span>
      </div>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("following");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.following || 0}</span>
        <span>Following</span>
      </div>
      {SHOW_COPY_TRADE && (
        <div className={styles.follwerItem}>
          <span className={styles.follwerAmount}>{copyTradersUserInfo?.copied}</span>
          <span>Coppied</span>
        </div>
      )}
    </div>
  );
}
