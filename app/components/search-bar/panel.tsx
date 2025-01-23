import styles from "./panel.module.css";
import CachedIcon from "./cached-icon";
import SearchIcon from "./search-icon";
import ItemCloseIcon from "./item-close-icon";
import { InfiniteScroll } from "antd-mobile";
import CircleLoading from "../icons/loading";
import Empty from "@/app/components/empty";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserAgent } from "@/app/context/user-agent";

export default function Panel({
  list = [],
  isLoading,
  searchText,
  setSearchText,
  hasMore,
  pageRef,
  cachedList,
  onSearch,
  onNextPage,
  onClose,
  removeCachedItem
}: any) {
  const router = useRouter();
  const isFirstPage = useMemo(() => pageRef.current === 1, [pageRef.current]);
  const { isMobile } = useUserAgent();

  return (
    (!!searchText || cachedList.length > 0) && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 346 }}
        exit={{ opacity: 0, height: 0 }}
        className={styles.Container}
        style={{
          backgroundColor: isMobile ? "#000" : "#1B1B1B",
          border: isMobile ? "none" : "1px solid #323232",
          borderRadius: isMobile ? "0px" : "0px 0px 20px 20px",
          borderTop: "none"
        }}
      >
        {!searchText &&
          cachedList.map((text: any, i: number) => (
            <div className={`${styles.Item} button`} key={text}>
              <div className={styles.ItemLeft}>
                <CachedIcon />
                <span
                  onClick={() => {
                    setSearchText(text);
                    onSearch(text);
                  }}
                >
                  {text}
                </span>
              </div>
              <ItemCloseIcon
                onClick={(ev: any) => {
                  ev.stopPropagation();
                  ev.nativeEvent.stopImmediatePropagation();
                  removeCachedItem(i);
                }}
              />
            </div>
          ))}
        {list.map((item: any) => (
          <div
            className={`${styles.Item} button`}
            key={item.id}
            onClick={() => {
              router.push(`/detail?address=${item.address}`);
              setTimeout(() => {
                onClose();
              }, 30);
            }}
          >
            <div className={styles.ItemLeft}>
              <SearchIcon size={13} color="#515B63" />
              <span>{item.token_name}</span>
            </div>
          </div>
        ))}
        {list.length > 0 && (
          // @ts-ignore
          <InfiniteScroll loadMore={onNextPage} hasMore={hasMore}>
            {hasMore && <CircleLoading size={20} />}
          </InfiniteScroll>
        )}
        {list.length === 0 && searchText && !isLoading && (
          <Empty height={"100%"} text="No results" />
        )}
        {isFirstPage && isLoading && (
          <div className={styles.LoadingWrapper}>
            <CircleLoading size={30} />
          </div>
        )}
      </motion.div>
    )
  );
}
