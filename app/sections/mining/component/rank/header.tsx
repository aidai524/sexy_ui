import styles from "./header.module.css";

export default function Header({
  onClick = () => {},
  isMobile = true,
  rank
}: any) {
  return (
    <div
      className={styles.Header}
      style={{
        padding: isMobile ? 0 : "20px 60px 15px",
        borderBottom: isMobile ? "none" : "1px solid #FFFFFF33"
      }}
      onClick={onClick}
    >
      <div className={styles.Title}>Reward Rank</div>
      <div className={styles.YourRank}>
        <span
          style={{
            fontSize: isMobile ? 10 : 12
          }}
        >
          Your Rank:
        </span>
        <div
          className={styles.YourRankTag}
          style={{
            fontSize: isMobile ? 10 : 14
          }}
        >
          {rank || "-"}
        </div>
      </div>
    </div>
  );
}
