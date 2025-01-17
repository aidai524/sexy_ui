import styles from './index.module.css';
import { useUser } from '@/app/store/useUser';
import { formatLongText } from '@/app/utils/common';
import QRCodeCom from '@/app/components/qrcode';
import React, { useImperativeHandle } from 'react';

const AirdropShareInfoCard = (props: any, ref: any) => {
  const { shareLink } = props;

  const { userInfo } = useUser();

  const refs = {};
  useImperativeHandle(ref, () => refs);

  return (
    <div className={styles.AirdropShareInfoCard}>
      <img
        src="/img/airdrop/icon-scan-me.svg"
        alt=""
        className={styles.AirdropShareInfoCardTip}
      />
      <img
        src={userInfo?.icon || '/img/airdrop/user-avatar.svg'}
        alt=""
        className={styles.AirdropShareInfoCardAvatar}
      />
      <div className={styles.AirdropShareInfoCardInfo}>
        <div className={styles.AirdropShareInfoCardInfoInviterLabel}>
          Inviter:
        </div>
        <div className={styles.AirdropShareInfoCardInfoInviter}>
          <div className={styles.AirdropShareInfoCardInfoAddress}>
            {formatLongText(userInfo?.address, 4, 4) || '-'}
          </div>
          <div className={styles.AirdropShareInfoCardInfoLevel}>
            <img
              src={userInfo?.level > 1 ? '/img/airdrop/user-level.svg' : '/img/airdrop/user-level-inactive.svg'}
              alt=""
              className={styles.AirdropShareInfoCardInfoLevelIcon}
            />
            <div>Lv.{userInfo?.level || 1}</div>
          </div>
        </div>
        <div className={styles.AirdropShareInfoCardInfoLink}>
          {formatLongText(shareLink, 22, 4)}
        </div>
      </div>
      <div className={styles.AirdropShareInfoCardFooter}>
        <QRCodeCom size={32} url={shareLink} />
        <img src="/img/airdrop/icon-logo-qr.svg" alt="" className={styles.AirdropShareInfoCardQrLogo} />
      </div>
    </div>
  );
};

export default React.forwardRef(AirdropShareInfoCard);
