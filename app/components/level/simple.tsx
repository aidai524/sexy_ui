import styles from "./simple.module.css";

export default function Simple({ level }: any) {
  const _level = level || 1;
  return (
    <div
      className={`${styles.Label} ${level > 3 ? styles.Upper : styles.Normal}`}
    >
      Lv.{_level}
    </div>
  );
}
