import styles from "./index.module.css";
import AirdropTitle from '@/app/sections/airdrop/components/title';
import AirdropCard from '@/app/sections/airdrop/components/card';
import AirdropConnectContent from '@/app/components/airdrop/connect/content';

const AirdropConnect = () => {

  return (
    <div className={styles.AirdropConnectContainer}>
      <AirdropTitle />
      <AirdropCard className={styles.AirdropConnectCard}>
        <AirdropConnectContent
          isHideClose
          style={{
            padding: '0 3px',
          }}
          descriptionStyle={{
            marginTop: 39,
          }}
          connectBtnStyle={{
            marginTop: 0,
          }}
          btnsStyle={{
            padding: 0,
            marginTop: 32,
          }}
        />
        <img src="/img/airdrop/title-coin.png" alt="" className={styles.AirdropConnectCardIcon} />
      </AirdropCard>
    </div>
  );
};

export default AirdropConnect;
