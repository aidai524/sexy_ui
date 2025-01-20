import styles from "./index.module.css";
import AirdropConnectBody from '@/app/sections/airdrop/components/connect/content';

const AirdropConnectLaptop = () => {

  return (
    <AirdropConnectBody
      className={styles.AirdropConnectCardLaptop}
      contentStyle={{}}
      descriptionStyle={{
        marginTop: 56,
        fontSize: 16,
      }}
      connectBtnStyle={{
        height: 60,
        fontSize: 16,
      }}
      btnsStyle={{
        marginTop: 70,
        padding: '0 10px',
      }}
      titleStyle={{
        fontSize: 26,
      }}
    />
  );
};

export default AirdropConnectLaptop;
