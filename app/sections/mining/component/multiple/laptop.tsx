import styles from "./laptop.module.css";

export default function Multiple({ num }: any) {
  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        <div className={styles.Num}>{num}</div>
        <div className={styles.Desc}>Points / Once like</div>
      </div>
    </div>
  );
}
