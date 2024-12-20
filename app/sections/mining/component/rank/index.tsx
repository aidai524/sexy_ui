import styles from "./index.module.css";
import Avatar from "./avatar";

export default function Rank() {
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.Title}>Mining Rank</div>
        <div className={styles.YourRank}>
          <span>Your Rank:</span>
          <div className={styles.YourRankTag}>123</div>
        </div>
      </div>
      <div className={styles.List}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div className={styles.Item} key={index}>
            <div className={styles.ItemLeft}>
              <Avatar rank={index + 1} />
              <div>
                <div className={styles.ItemTitle}>Party Girl</div>
                <div className={styles.ItemDesc}>245 followers</div>
              </div>
            </div>
            <div className={styles.ItemRight}>3.52M</div>
          </div>
        ))}
      </div>
    </div>
  );
}
