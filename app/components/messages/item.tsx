import { Avatar, ReadAvatar } from "./avatar";
import styles from "./index.module.css";
import dayjs from "dayjs";

export default function Item({ item }: any) {
  return (
    <div className={styles.Item}>
      <div className={styles.ItemInfo}>
        {item.read ? <ReadAvatar /> : <Avatar />}
        <div>
          <div className={styles.ItemTitle} style={{}}>
            {item.type}
          </div>
          <div className={styles.ItemDesc}>{item.content1}</div>
        </div>
      </div>
      <div className={styles.ItemTime}>{dayjs(item.time).fromNow()}</div>
    </div>
  );
}
