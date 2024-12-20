import styles from "./avatar.module.css";
import Rank from "./rank-icon";
export default function Avatar({ src, rank }: any) {
  return (
    <div className={styles.AvatarWrapper}>
      <img src={src} className={styles.Avatar} />
      <Rank rank={rank} />
    </div>
  );
}
