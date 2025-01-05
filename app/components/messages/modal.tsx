import Modal from "../modal";
import Header from "./header";
import { Avatar, ReadAvatar } from "./avatar";
import { Ellipsis, InfiniteScroll } from "antd-mobile";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./modal.module.css";
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useRouter } from "next/navigation";
import CircleLoading from "../icons/loading";
import config from "./config";
import { useAuth } from "@/app/context/auth";

export default function MessagesModal({
  open,
  onClose,
  list,
  feeds,
  num,
  hasMore,
  loading,
  page,
  onNextPage,
  onRead
}: any) {
  const { isMobile } = useUserAgent();

  const [currentTab, setCurrentTab] = useState("inform");
  const data = useMemo(
    () => (currentTab === "inform" ? list : feeds),
    [currentTab, list]
  );
  const isFirstPage = useMemo(() => page.current === 1, [page.current]);
  console.log(35, data, isFirstPage);
  return (
    <Modal
      open={open}
      mainStyle={{
        border: "none"
      }}
    >
      <div className={styles.Container}>
        <Header
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          onClose={onClose}
          num={num}
        />
        <AnimatePresence initial={false}>
          <div
            className={styles.Content}
            style={{
              padding: isMobile ? "10px" : "24px 30px"
            }}
          >
            {data.map((item: any) => (
              <Item
                key={item.id}
                item={item}
                isMobile={isMobile}
                onRead={onRead}
                onClose={onClose}
              />
            ))}
            {data.length > 0 && (
              <InfiniteScroll loadMore={onNextPage} hasMore={hasMore}>
                {hasMore && <CircleLoading size={20} />}
              </InfiniteScroll>
            )}
            {data.length === 0 && !loading ? (
              <div className={styles.EmptyText}>No information</div>
            ) : (
              isFirstPage && (
                <div className={styles.LoadingWrapper}>
                  <CircleLoading size={30} />
                </div>
              )
            )}
          </div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}

const Item = ({ item, isMobile, onRead, onClose }: any) => {
  const [expand, setExpand] = useState(false);
  const router = useRouter();
  const { userInfo } = useAuth();
  const [title, content, linkText, link, pageName] = useMemo(() => {
    const r = config[item.type];
    if (r) return r(item, userInfo);
    return ["", "", "", "", ""];
  }, [item]);
  return (
    <motion.div
      initial={{
        height: !expand ? "auto" : 70
      }}
      animate={{
        height: expand ? "auto" : 70
      }}
      exit={{
        height: !expand ? "auto" : 70
      }}
      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
      className={styles.Item}
      style={{
        marginBottom: isMobile ? "8px" : "16px"
      }}
    >
      <div
        className={styles.ItemTop}
        style={{
          padding: isMobile ? "8px" : "16px 20px"
        }}
      >
        {item.read ? <ReadAvatar /> : <Avatar />}
        <div className={styles.ItemContent}>
          <div className={styles.ItemTitle} style={{}}>
            {title}
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
        {!expand && (
          <div className={styles.ItemLeft} style={{ flexShrink: 0 }}>
            <div className={styles.ItemTime}>{dayjs(item.time).fromNow()}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
              className="button"
              onClick={() => {
                setExpand(true);
              }}
            >
              <path
                d="M1.00037 0.656854L6.65723 6.31371L12.3141 0.656854"
                stroke="#80787B"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>
      {expand && (
        <div
          className={styles.ItemBottom}
          style={{
            padding: isMobile ? "8px" : "8px 20px 16px 70px"
          }}
        >
          <div className={styles.ItemTime}>{dayjs(item.time).fromNow()}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            className="button"
            onClick={() => {
              setExpand(false);
            }}
          >
            <path
              d="M1.00037 7.34315L6.65723 1.68629L12.3141 7.34315"
              stroke="#80787B"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
};
