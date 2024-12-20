import styles from "./index.module.css";
export default function CreateButton() {
  return (
    <button className={styles.MiningAndCreateButton}>
      <img src="/img/tabs/tab3-active.svg" className={styles.CreateIcon} />
      <span>Create</span>
    </button>
  );
}
