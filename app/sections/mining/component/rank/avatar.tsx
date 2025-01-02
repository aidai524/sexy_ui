import styles from "./avatar.module.css";
import Rank from "./rank-icon";
import { defaultAvatar } from "@/app/utils/config";
export default function Avatar({ src, rank }: any) {
  return (
    <div className={styles.AvatarWrapper}>
      <img src={src || defaultAvatar} className={styles.Avatar} />
      <Rank rank={rank} />
    </div>
  );
}
