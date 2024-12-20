import styles from "./index.module.css";

export default function Badge({ children, number, isSimple = false }: any) {
  return (
    <div className={styles.Container}>
      {children}
      {!!number && (
        <div
          className={`${styles.Badge} ${
            !isSimple ? styles.BadgeWithNumber : styles.BadgeWithEmpty
          }`}
        >
          {isSimple ? "" : number}
        </div>
      )}
    </div>
  );
}
