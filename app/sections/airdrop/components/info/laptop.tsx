import styles from "./index.module.css";
import AirdropInfoContent from '@/app/sections/airdrop/components/info/content';

const AirdropInfoLaptop = () => {

  return (
    <AirdropInfoContent
      className={styles.AirdropInfoCardLaptop}
      titleClassName={styles.AirdropInfoCardLaptopTitle}
    />
  );
};

export default AirdropInfoLaptop;
