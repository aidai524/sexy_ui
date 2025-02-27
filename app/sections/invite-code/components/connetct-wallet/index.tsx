import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { WalletModalButton } from '@/app/libs/solana/wallet-adapter/modal';
import Loading from '@/app/components/icons/loading';

const InviteCodeConnectWallet: React.FC<any> = (props) => {
  const { className, loading } = props;

  return (
    <div className={clsx(styles.InviteCodeConnectWalletContainer, className)}>
      <img src="/img/invite-code/connect-wallet-banner.png" alt="" className={styles.Banner} />
      {
        loading ? (
          <button
            type="button"
            className={styles.Button}
          >
            <Loading size={16} />
            <div>Connect Wallet</div>
          </button>
        ) : (
          <WalletModalButton style={{ marginTop: 0 }}>
            Connect Wallet
          </WalletModalButton>
        )
      }
    </div>
  );
};

export default InviteCodeConnectWallet;
