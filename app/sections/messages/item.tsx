import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "./config";
import dayjs from "dayjs";
import styles from "./item.module.css";
import { Avatar, ReadAvatar } from "./avatar";
export default function Item({
  item,
  isMobile,
  onRead,
  onClose,
  onSuccess
}: any) {
  const [expand, setExpand] = useState(false);
  const router = useRouter();
  const { userInfo } = useAuth();
  const [isRead, setIsRead] = useState(item.read);
  const [title, content, linkText, link, pageName] = useMemo(() => {
    const r = config[item.type];
    if (r) return r(item, userInfo);
    return ["", "", "", "", ""];
  }, [item]);

  useEffect(() => {
    setIsRead(item.read);
  }, [item.read]);
  return (
    <div
      className={`${styles.Item} button`}
      style={{
        marginBottom: isMobile ? "8px" : "16px"
      }}
      onClick={() => {
        setExpand(!expand);
        if (isRead) return;
        onRead({
          ids: [item.id],
          onSuccess() {
            setIsRead(true);
            onSuccess?.();
          }
        });
      }}
    >
      <div
        className={styles.ItemTop}
        style={{
          padding: isMobile ? "8px" : "16px 20px"
        }}
      >
        <div style={{ flexShrink: 0 }}>
          {isRead ? <ReadAvatar /> : <Avatar />}
        </div>
        <div className={styles.ItemContent}>
          <div className={styles.ItemTitle} style={{}}>
            <span>{title}</span>
            <div className={styles.ItemTime}>{dayjs(item.time).fromNow()}</div>
          </div>
          {expand ? (
            <>
              <div className={styles.ItemDesc}>{content}</div>
              {linkText && link && (
                <button
                  className={styles.ItemLink}
                  onClick={() => {
                    onClose?.();
                    isMobile
                      ? router.push(link)
                      : history.pushState(
                          { page: link.split("?")[0] },
                          pageName,
                          link
                        );
                  }}
                >
                  {linkText}
                </button>
              )}
            </>
          ) : (
            <div className={`${styles.ItemDesc} ${styles.Ellipsis}`}>
              {content}
            </div>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="8"
          viewBox="0 0 13 8"
          fill="none"
          className={styles.Arrow}
          style={{
            transform: `rotate(${expand ? 180 : 0}deg)`
          }}
        >
          <path
            d="M1.00037 0.656854L6.65723 6.31371L12.3141 0.656854"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
