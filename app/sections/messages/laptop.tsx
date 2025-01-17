import { motion } from "framer-motion";
import styles from "./laptop.module.css";
import Item from "./item";
import Empty from "@/app/components/empty";
import CircleLoading from "@/app/components/icons/loading";
import { InfiniteScroll } from "antd-mobile";
import useList from "@/app/components/messages/use-list";
import useRead from "@/app/components/messages/use-read";
import { useMessages } from "@/app/context/messages";
import { useState, useMemo, useEffect } from "react";
export default function Laptop({}: any) {
  const { list, loading, hasMore, page, onInit, onNextPage } = useList();
  const { onRead } = useRead();
  const { num, onQuery } = useMessages();
  const [informNum, setInforNum] = useState(num);
  const isFirstPage = useMemo(() => page.current === 1, [page.current]);
  useEffect(() => {
    setInforNum(num);
  }, [num]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Wrapper}
    >
      <div className={styles.TitleWrapper}>
        <span>Notifications </span>
        <span className={styles.Num}>{informNum}</span>
      </div>

      <div className={styles.Container}>
        <div className={styles.ReadAll}>
          <button
            className="button"
            onClick={() => {
              onRead({
                ids: [],
                onSuccess: () => {
                  onInit();
                  onQuery();
                }
              });
            }}
          >
            Read all
          </button>
        </div>
        <div
          className={styles.Content}
          style={{
            padding: "10px"
          }}
        >
          <div className={styles.List}>
            {list.map((item: any) => (
              <Item
                key={item.id}
                item={item}
                isMobile={true}
                onRead={onRead}
                onSuccess={() => {
                  if (informNum > 0) {
                    setInforNum(informNum - 1);
                  }
                }}
              />
            ))}
            {list.length > 0 && (
              // @ts-ignore
              <InfiniteScroll loadMore={onNextPage} hasMore={hasMore}>
                {hasMore && <CircleLoading size={20} />}
              </InfiniteScroll>
            )}
            {list.length === 0 && !loading ? (
              <Empty height={300} text="No notifications" />
            ) : (
              isFirstPage && (
                <div className={styles.LoadingWrapper}>
                  <CircleLoading size={30} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
