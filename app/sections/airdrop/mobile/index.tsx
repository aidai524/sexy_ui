import styles from './index.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import AirdropInfo from '@/app/sections/airdrop/components/info';
import AirdropConnect from '@/app/sections/airdrop/components/connect';

const AirdropMobile = () => {
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

export default AirdropMobile;
