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
        padding: isMobile ? 0 : "15px 25px 0px"
      }}
      onClick={onClick}
    >
      <div className={styles.Title}>Reward Rank</div>
      <div className={styles.YourRank}>
        <span
          style={{
            fontSize: 12
          }}
        >
          Your Rank:
        </span>
        <div
          className={styles.YourRankTag}
          style={{
            fontSize: isMobile ? 12 : 14
          }}
        >
          {rank || "-"}
        </div>
      </div>
    </div>
  );
}
