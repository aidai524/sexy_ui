import styles from "./index.module.css";

export default function FollowerActions({ userInfo, style, onItemClick }: any) {
  return (
    <div className={styles.follwerActions} style={style}>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("followers");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.followers || 0}</span>
        <span>Followers</span>
      </div>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("following");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.following || 0}</span>
        <span>Following</span>
      </div>
      <div className={styles.follwerItem}>
        <span className={styles.follwerAmount}>{userInfo?.likeNum}</span>
        <span>Coppied</span>
      </div>
    </div>
  );
}
