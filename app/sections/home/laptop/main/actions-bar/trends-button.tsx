import styles from "./index.module.css";
export default function MiningButton({ id }: any) {
  return (
    <a id={id} href="/trends" className={styles.MiningAndCreateButton}>
      <img src="/img/tabs/tab5-active.svg" className={styles.MiningIcon} />
      <span>TRENDS</span>
    </a>
  );
}
