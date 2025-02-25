import styles from './index.module.css';
import { useUser } from '@/app/store/useUser';
import { formatLongText } from '@/app/utils/common';
import QRCodeCom, { QRCodeImage } from '@/app/components/qrcode';
import React, { useContext, useImperativeHandle } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';

const AirdropShareInfoCard = (props: any, ref: any) => {
  const { shareLink, copyTradersUserInfo } = props;

  const { userInfo } = useUser();
  console.log(userInfo, 'userInfo');
  const {
    userData,
    userHasPoints,
  } = useContext(AirdropContext);

  const refs = {};
  useImperativeHandle(ref, () => refs);

  const formatPnl = (pnl: string) => {
    if (pnl == '0') {
      return '0';
    }
    if (pnl.startsWith('-')) {
      return '-' + numberFormatter(Math.abs(Number(pnl)), 2, true);
    }
    return '+' + numberFormatter(pnl, 2, true);
}


const formatWinRate = (winRate: string) => {
  if (winRate == '0') {
    return '0%';
  }
  return new Big(winRate).times(100).toFixed(1) + '%';
}
  return (
    <div className={styles.CopyTradeShareInfoCardContainer}>
      <div className={styles.CopyTradeShareInfoCard}>
        <div className={styles.CopyTradeShareInfoCardContent}>
          <div className={styles.CopyTradeShareInfoCardTitle}>Copied PRFM</div>
          <div className={styles.avatarAndName}>
            <img src={userInfo?.icon} alt="" className={styles.CopyTradeShareInfoCardAvatar}/>
            <div className={styles.CopyTradeShareInfoCardName}>{formatLongText(userInfo?.name)}</div>
          </div>
          <div className={styles.publicStyle}>
            <span className={styles.publicStyleTitle}>Total PNL</span>
            <span>
              <span className={styles.publicStylePNL}>{formatPnl(copyTradersUserInfo?.tradeInfo?.totalPNL || '0')}</span>
               <span className={styles.publicStyleValueCurrency}>SOL</span>
            </span>
          </div>

          <div className={styles.ROIandWinRate}>
                <div className={styles.publicStyle}>
                  <span className={styles.publicStyleTitle}>ROI</span>
                  <span className={styles.publicStyleValue}>{formatWinRate(copyTradersUserInfo?.tradeInfo?.roi || '0')}</span>
                </div>
                <div className={styles.publicStyle}>
                  <span className={styles.publicStyleTitle}>Win Rate</span>
                  <span className={styles.publicStyleValue}>{formatWinRate(copyTradersUserInfo?.tradeInfo?.winRate || '0')}</span>
                </div>
          </div>
        </div>
      
      </div>
     <div className={styles.CopyTradeShareInfoCardFooter}>
      <div className={styles.FlipImgContainer}>
        <img src="/img/smart/flipN.png" alt="flipn" className={styles.FlipImg} />
        <img src="/img/smart/flipNDesc.png" alt="flipn desc" className={styles.FlipImgDesc} />
      </div>
      <div className={styles.QRCodeContainer}>
      <QRCodeImage size={60} url={shareLink} scale={2} />
      </div>
   </div>
   </div>
  );
};

export default React.forwardRef(AirdropShareInfoCard);
