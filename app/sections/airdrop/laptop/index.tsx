import styles from './index.module.css';
import AirdropTitle from '@/app/sections/airdrop/components/title';
import AirdropConnect from '@/app/sections/airdrop/components/connect';
import AirdropInfo from '@/app/sections/airdrop/components/info';
import ExpandPanelLinks from '@/app/components/layout/laptop/menu/expand-panel/links';
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';

const AirdropLaptop = () => {
  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  const isConnected = address && accountRefresher;

  return (
    <div className={styles.AirdropContainer}>
      <div className={styles.AirdropInner}>
        <div className={isConnected ? styles.AirdropLeftConnected : styles.AirdropLeft}>
          <AirdropTitle />
          <img
            src="/img/airdrop/slogan.png"
            alt=""
            className={styles.AirdropSlogan}
          />
          {
            isConnected ? (
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
