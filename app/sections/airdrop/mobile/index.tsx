import styles from './index.module.css';
import AirdropInfo from '@/app/sections/airdrop/components/info';
import AirdropConnect from '@/app/sections/airdrop/components/connect';
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';

const AirdropMobile = () => {
  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  const isConnected = address && accountRefresher;

  return (
    <div className={styles.AirdropContainer}>
      <div className={styles.AirdropWrapper}>
        {
          isConnected ? (
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
