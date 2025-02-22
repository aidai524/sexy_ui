import styles from './index.module.css';
import { useUser } from '@/app/store/useUser';
import { formatLongText } from '@/app/utils/common';
import QRCodeCom, { QRCodeImage } from '@/app/components/qrcode';
import React, { useContext, useImperativeHandle } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { numberFormatter } from '@/app/utils/common';
import { ShareTitleIcon,TopTraderCrown } from "@/app/sections/trends/components/top-traders/icons";
import { defaultAvatar } from "@/app/utils/config";


const TopTraderShareInfoCard = (props: any, ref: any) => {
  const { shareLink, selectedItems, currentUserInfo } = props;

  const { userInfo } = useUser();
  console.log(userInfo,currentUserInfo, 'userInfo');
  console.log(selectedItems, 'selectedItems');
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
      return '-' + numberFormatter(Math.abs(Number(pnl)), 4, true);
    }
    return '+' + numberFormatter(pnl, 4, true);
}

  return (
    <div className={styles.CopyTradeShareInfoCardContainer}>
      <div className={styles.CopyTradeShareInfoCard}>
        <ShareTitleIcon style={{position:'absolute',top:'-30px',left:'0px'}}/>
        <div className={styles.CopyTradeShareInfoCardContent}>
          <div className={styles.avatarAndName}>
            <img src={currentUserInfo?.icon || defaultAvatar} alt="" className={styles.CopyTradeShareInfoCardAvatar}/>
            <div>
              <div className={styles.CopyTradeShareInfoCardName}>{formatLongText(currentUserInfo?.name || 'FlipN')}</div>
              <div><TopTraderCrown /></div>
            </div>
          </div>
          <div className={styles.CopyTradeShareInfoCardContentList}>
            {
              Object.entries(selectedItems).map(([key, v]:any) => {
                return (
                v.value ? (
                  <div className={styles.CopyTradeShareInfoCardContentListItem} key={key}>
                  <div className={styles.CopyTradeShareInfoCardContentListItemTitle}>{v.title}</div>
                  <div className={styles.CopyTradeShareInfoCardContentListItemValue}>
                    <span className={v.useWhite ? styles.CopyTradeShareInfoCardContentListItemValueTextWhite : styles.CopyTradeShareInfoCardContentListItemValueText}>{v.value ? v.useValue : ''}</span>
                    {v.useExtraValue && <span className={styles.CopyTradeShareInfoCardContentListItemValueTextRed}>{v.useExtraValue}</span>}
                    <span className={styles.CopyTradeShareInfoCardContentListItemValueCurrency}>{v.value ? v.useValueCurrency : ''}</span>
                  </div>
                </div>
                ) : null
              )
            })
          }
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

export default React.forwardRef(TopTraderShareInfoCard);


