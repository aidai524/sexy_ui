import styles from "./avatar.module.css";
import Rank from "./rank-icon";
import { defaultAvatar } from "@/app/utils/config";
export default function Avatar({ src, rank, isUser }: any) {
  return (
    <div className={styles.AvatarWrapper}>
      <Rank
        rank={rank}
        isUser={isUser}
        textClassName={isUser && styles.UserRank}
      />
      <img src={src || defaultAvatar} className={styles.Avatar} />
    </div>
  );
}
