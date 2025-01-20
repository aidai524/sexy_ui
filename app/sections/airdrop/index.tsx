'use client';

import styles from './index.module.css';
import AirdropConnect from '@/app/sections/airdrop/components/connect';
import AirdropInfo from '@/app/sections/airdrop/components/info';
import { useWallet } from '@solana/wallet-adapter-react';

const AirdropView = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.AirdropContainer}>
      <div className={styles.AirdropWrapper}>
        {
          connected ? (
            <AirdropInfo />
          ) : (
            <AirdropConnect />
          )
        }
        <div className={styles.AirdropFootBanner}></div>
      </div>
    </div>
  );
};

export default AirdropView;
