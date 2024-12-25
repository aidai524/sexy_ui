import styles from "./index.module.css";
export default function CreateButton({ id }: any) {
  return (
    <a id={id} href="/create" className={styles.MiningAndCreateButton}>
      <img src="/img/tabs/tab3-active.svg" className={styles.CreateIcon} />
      <span>CREATE</span>
    </a>
  );
}
