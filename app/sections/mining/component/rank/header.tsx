import styles from "./header.module.css";

export default function Header({
  onClick = () => {},
  text = "Leaderboard"
}: any) {
  return (
    <div
      className={styles.Header}
      style={{
        padding: "0px 12px"
      }}
      onClick={onClick}
    >
      <div className={styles.Title}>{text}</div>
    </div>
  );
}
