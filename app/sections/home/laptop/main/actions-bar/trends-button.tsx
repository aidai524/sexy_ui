import styles from "./index.module.css";
export default function MiningButton() {
  return (
    <a href="/trends" className={styles.MiningAndCreateButton}>
      <img src="/img/tabs/tab5-active.svg" className={styles.MiningIcon} />
      <span>TRENDS</span>
    </a>
  );
}
