import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "./close-icon";
import SearchIcon from "./search-icon";
import Panel from "./panel";
import { useEffect, useState } from "react";
import useSearch from "@/app/hooks/use-search";
import { useDebounceFn } from "ahooks";
import { useSearchStore } from "@/app/store/use-search";

export default function SearchBar() {
  const { isMobile } = useUserAgent();
  const [expand, setExpand] = useState(false);

  const {
    list,
    isLoading,
    searchText,
    hasMore,
    pageRef,
    setIsLoading,
    setSearchText,
    onSearch,
    onNextPage,
    onClear
  } = useSearch();
  const searchStore: any = useSearchStore();

  const { run: onSearchDebounce } = useDebounceFn(
    (text) => {
      onSearch(text);
      searchStore.addCachedItem(text);
    },
    { wait: 500 }
  );

  useEffect(() => {
    const close = () => {
      setExpand(false);
      onClear();
    };
    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <div className={styles.Wrapper}>
      <SearchIcon
        className={`${styles.SearchButton} button`}
        size={18}
        onClick={(ev: any) => {
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
          setExpand(true);
        }}
      />

      <AnimatePresence mode="wait">
        {expand && (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, width: 30 }}
            animate={{ opacity: 1, width: isMobile ? "100vw" : "584px" }}
            exit={{ opacity: 0, width: 30 }}
            className={styles.Container}
            onClick={(ev) => {
              ev.stopPropagation();
              ev.nativeEvent.stopImmediatePropagation();
            }}
            style={
              isMobile
                ? {
                    left: 0,
                    top: 0,
                    backgroundColor: "#000"
                  }
                : {
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: 6,
                    backgroundColor: "#1B1B1B",
                    border: "1px solid #323232",
                    borderRadius: "20px 20px 0px 0px"
                  }
            }
          >
            <div
              className={styles.InputWrapper}
              style={{ width: isMobile ? "calc(100% - 60px)" : "100%" }}
            >
              <input
                type="text"
                className={styles.Input}
                value={searchText}
                placeholder="Search project name or address"
                onChange={(ev) => {
                  setSearchText(ev.target.value);
                  if (ev.target.value) {
                    setIsLoading(true);
                    onSearchDebounce(ev.target.value);
                  }
                }}
                autoFocus={true}
              />
              <div className={styles.InputActions}>
                <button
                  className={`${styles.Action} button`}
                  onClick={() => {
                    onClear();
                  }}
                >
                  <CloseIcon />
                </button>
                <button
                  className={`${styles.Action} button`}
                  onClick={() => {}}
                  style={{
                    paddingRight: 14
                  }}
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
            <div
              className={`${styles.Cancel} button`}
              onClick={() => {
                onClear();
                setExpand(false);
              }}
            >
              Cancel
            </div>
            <Panel
              {...{
                list,
                isLoading,
                searchText,
                setSearchText,
                pageRef,
                hasMore,
                onSearch,
                onClose: () => {
                  onClear();
                  setExpand(false);
                },
                onNextPage,
                cachedList: searchStore.cachedList,
                removeCachedItem: searchStore.removeCachedItem
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
