import styles from "./index.module.css";

const AirdropHeader = (props: any) => {
  const { } = props;

  return (
    <div className={styles.AirdropHeaderContainer}>
      <img src="/img/airdrop/header.png" alt="" className={styles.AirdropHeaderImage} />
    </div>
  );
};

export default AirdropHeader;
