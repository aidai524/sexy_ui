import styles from "./index.module.css";
import Top from "@/app/sections/trends/components/top";
import { useTrends } from "@/app/sections/trends/hooks";
import GoBack from "@/app/components/back/laptop";
import Hottest from "@/app/sections/trends/components/hottest";
import List from "@/app/sections/trends/components/list";
import { motion } from "framer-motion";
import { useEffect } from 'react';

const Laptop = (props: any) => {
  const { handleBuy } = props;

  const {
    tableList,
    hottestList,
    top1,
    top1Loading,
    tableListLoading,
    hottestListLoading,
    getHottestList,
    getTableList,
    handleCurrentFilter,
    currentFilter,
    handleOrderBy,
    orderBy,
    searchText,
    handleSearchText,
    handleSearchTextClear,
    tableListPageMore,
    tableListPageIndex,
  } = useTrends();

  useEffect(() => {
    getHottestList();
    getTableList({ pageIndex: 0 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Container}
    >
      <div className={styles.Back}>
        <GoBack />
      </div>
      <Top onBuy={() => handleBuy(top1)} trend={top1} />
      <Hottest data={hottestList} onBuy={handleBuy} loading={hottestListLoading} />
      <List
        loading={top1Loading || tableListLoading || hottestListLoading}
        currentFilter={currentFilter}
        onCurrentFilter={handleCurrentFilter}
        data={tableList?.filter?.((it) => top1?.address !== it.address && !hottestList?.some((_it) => _it.address === it.address))}
        orderBy={orderBy}
        onOrderBy={handleOrderBy}
        searchText={searchText}
        onSearchText={handleSearchText}
        onSearchTextClear={handleSearchTextClear}
        getTableList={getTableList}
        tableListPageMore={tableListPageMore}
        tableListPageIndex={tableListPageIndex}
      />
    </motion.div>
  );
};

export default Laptop;
