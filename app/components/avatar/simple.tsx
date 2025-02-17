import { ReadAvatar } from "@/app/sections/messages/avatar";
import styles from "./simple.module.css";
export default function SimpleAvatar({ icon, size = 30 }: any) {
  return (
    <div className={styles.Avatar} style={{ width: size, height: size }}>
      {icon ? (
        <img src={icon} className={`${styles.Logo}`} />
      ) : (
        <ReadAvatar size={size} />
      )}
    </div>
  );
}
