import Item from "./item";
import styles from "./index.module.css";

export default function Trends() {
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <img src="/img/trends/title.png" className={styles.HeaderTitle} />
      </div>
      <div className={styles.Content}>
        <Item rank={1} />
        <Item rank={2} />
        <Item rank={3} />
        <Item rank={4} />
        <Item rank={5} />
        <Item rank={6} />
        <Item rank={7} />
      </div>
    </div>
  );
}
