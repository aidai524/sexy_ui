import styles from "./index.module.css";

export default function FollowerActions({ userInfo, onItemClick }: any) {
  return (
    <div className={styles.follwerActions}>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("followers");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.followers}</span>
        <span>Followers</span>
      </div>
      <div
        className={styles.follwerItem}
        onClick={() => {
          onItemClick("following");
        }}
      >
        <span className={styles.follwerAmount}>{userInfo?.following}</span>
        <span>Following</span>
      </div>
      {/* <div className={styles.follwerItem}>
        <span className={styles.follwerAmount}>{userInfo?.likeNum}</span>
        <span>Likes</span>
      </div> */}
    </div>
  );
}
