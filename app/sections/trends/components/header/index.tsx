import styles from "./index.module.css";

export default function Header() {
  return (
    <div className={styles.Header}>
      <img src="/img/trends/title.png" className={styles.HeaderTitle} />
    </div>
  );
}
