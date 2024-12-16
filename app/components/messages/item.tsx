import { Avatar } from "./avatar";
import styles from "./index.module.css";

export default function Item() {
  return (
    <div className={styles.Item}>
      <div className={styles.ItemInfo}>
        <Avatar style={{}} />
        <div>
          <div className={styles.ItemTitle} style={{}}>
            Sexy Fi
          </div>
          <div className={styles.ItemDesc}>
            Your VIP purchase is successful! Valid until December 30, 2024.
          </div>
        </div>
      </div>
      <div className={styles.ItemTime}>33 mins ago</div>
    </div>
  );
}
