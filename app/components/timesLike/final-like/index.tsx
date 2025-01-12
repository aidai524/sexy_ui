import styles from "./index.module.css";

export default function FinalLike({ token }: any) {
  return (
    <div className={styles.Container}>
      <div className={styles.Title}>Thanks for your final like❤️</div>
      <div className={styles.Desc}>
        <img className={styles.Avatar} src={token.tokenIcon} />
        <div>{token.tokenName} IS LAUNCHING!</div>
      </div>
    </div>
  );
}
