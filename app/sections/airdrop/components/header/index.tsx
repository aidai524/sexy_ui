import styles from "./index.module.css";

const AirdropHeader = (props: any) => {
  const { } = props;

  return (
    <div className={styles.AirdropHeaderContainer}>
      <img src="/img/airdrop/logo.svg" alt="" className={styles.AirdropHeaderImageLogo} />
      <img src="/img/airdrop/slogan.png" alt="" className={styles.AirdropHeaderImageSlogan} />
    </div>
  );
};

export default AirdropHeader;
