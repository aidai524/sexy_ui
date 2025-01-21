import styles from './index.module.css';
import AirdropTitle from '@/app/sections/airdrop/components/title';
import AirdropConnect from '@/app/sections/airdrop/components/connect';
import { useWallet } from '@solana/wallet-adapter-react';
import AirdropInfo from '@/app/sections/airdrop/components/info';
import ExpandPanelLinks from '@/app/components/layout/laptop/menu/expand-panel/links';

const AirdropLaptop = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.AirdropContainer}>
      <div className={styles.AirdropInner}>
        <div className={connected ? styles.AirdropLeftConnected : styles.AirdropLeft}>
          <AirdropTitle />
          <img
            src="/img/airdrop/slogan.png"
            alt=""
            className={styles.AirdropSlogan}
          />
          {
            connected ? (
              <AirdropInfo />
            ) : (
              <AirdropConnect />
            )
          }
          <div className={styles.AirdropLinks}>
            <ExpandPanelLinks className={styles.AirdropLinksInner} />
          </div>
        </div>
        <div className={styles.AirdropRight}>
          <img src="/img/airdrop/cars.svg" alt="" className={styles.AirdropRightImage} />
        </div>
      </div>
    </div>
  );
};

export default AirdropLaptop;
