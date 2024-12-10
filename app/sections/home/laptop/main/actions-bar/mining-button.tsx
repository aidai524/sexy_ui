import styles from "./index.module.css";
export default function MiningButton() {
  return (
    <button className={styles.MiningAndCreateButton}>
      <img src="/img/tabs/tab2-active.svg" className={styles.MiningIcon} />
      <span>Mining</span>
    </button>
  );
}
