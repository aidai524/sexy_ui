import { Avatar, ReadAvatar } from "./avatar";
import styles from "./index.module.css";
import dayjs from "dayjs";
import config from "./config";
import { useMemo } from "react";
import { useAuth } from "@/app/context/auth";

export default function Item({ item }: any) {
  const { userInfo } = useAuth();
  const [title, content, linkText, link, pageName] = useMemo(() => {
    const r = config[item.type];
    if (r) return r(item, userInfo);
    return ["", "", "", "", ""];
  }, [item]);
  return (
    <div className={styles.Item}>
      <div className={styles.ItemInfo}>
        {item.read ? <ReadAvatar /> : <Avatar />}
        <div>
          <div className={styles.ItemTitle} style={{}}>
            {title}
          </div>
          <div className={styles.ItemDesc}>{content}</div>
        </div>
      </div>
      <div className={styles.ItemTime}>{dayjs(item.time).fromNow()}</div>
    </div>
  );
}
