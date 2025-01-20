import styles from "./index.module.css";
import AirdropCard from '@/app/sections/airdrop/components/card';
import AirdropConnectContent from '@/app/components/airdrop/connect/content';

const AirdropConnectBody = (props: any) => {
  const { className, contentStyle, descriptionStyle, connectBtnStyle, btnsStyle, titleStyle } = props;

  return (
    <AirdropCard className={[styles.AirdropConnectCard, className].join(' ')}>
      <AirdropConnectContent
        isHideClose
        style={{
          padding: '0 3px',
          ...contentStyle,
        }}
        titleStyle={{
          ...titleStyle,
        }}
        descriptionStyle={{
          marginTop: 39,
          ...descriptionStyle,
        }}
        connectBtnStyle={{
          marginTop: 0,
          ...connectBtnStyle,
        }}
        btnsStyle={{
          padding: 0,
          marginTop: 32,
          ...btnsStyle,
        }}
      />
      <img src="/img/airdrop/title-coin.png" alt="" className={styles.AirdropConnectCardIcon} />
    </AirdropCard>
  );
};

export default AirdropConnectBody;
