import styles from "./index.module.css";

export default function Item({ rank }: any) {
  return (
    <div
      className={`${styles.Item} ${
        rank === 1 ? styles.FirstItem : styles.OthersItem
      }`}
    >
      <img
        src={
          "https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect"
        }
        className={styles.ItemImage}
      />
      <div
        className={`${styles.ItemContent} ${
          rank === 1 ? styles.FirstItemContent : styles.OthersItemContent
        }`}
      >
        <div
          className={`${
            rank === 1 ? styles.FirstItemRank : styles.OthersItemRank
          }`}
        >
          {rank}
        </div>
        <div className={styles.ItemInfo}>
          <div className={styles.ItemTitle}>VVAIFU</div>
          <div className={styles.ItemTicker}>Ticker: VVA</div>
          <div className={styles.ItemVolum}><span className={ styles.mc }>Market Cap:</span> $206.86K</div>
        </div>
      </div>
    </div>
  );
}
