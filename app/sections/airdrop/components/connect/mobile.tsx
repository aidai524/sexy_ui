import styles from "./index.module.css";
import AirdropTitle from '@/app/sections/airdrop/components/title';
import AirdropConnectBody from '@/app/sections/airdrop/components/connect/content';

const AirdropConnectMobile = () => {

  return (
    <div className={styles.AirdropConnectContainer}>
      <AirdropTitle />
      <AirdropConnectBody />
    </div>
  );
};

export default AirdropConnectMobile;
