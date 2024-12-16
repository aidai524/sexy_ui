import styles from "./index.module.css";

export default function Badge({ children, number }: any) {
  return (
    <div className={styles.Container}>
      {children}
      <div
        className={`${styles.Badge} ${
          number ? styles.BadgeWithNumber : styles.BadgeWithEmpty
        }`}
      >
        {number || ""}
      </div>
    </div>
  );
}
