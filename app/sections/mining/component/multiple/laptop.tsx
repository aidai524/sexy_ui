import styles from "./laptop.module.css";

export default function Laptop({ num }: any) {
  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        <div className={styles.Box}>
          <div className={styles.Text}>{num}</div>
        </div>
      </div>

      <img className={styles.BigIcon} src="/img/tabs/tab2-active.svg" />
      <img className={styles.SmallIcon} src="/img/tabs/tab2-active.svg" />
    </div>
  );
}
