import styles from "./index.module.css";

export default function Address({ address }: any) {
  return (
    <div
      className={styles.addressContent}
      onClick={() => {
        window.open(`https://solscan.io/account/${address}?cluster=devnet`);
      }}
    >
      <div>{address}</div>
    </div>
  );
}
