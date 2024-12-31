import styles from "./index.module.css";
import Top from "@/app/sections/trends/components/top";
import { useTrends } from "@/app/sections/trends/hooks";
import GoBack from "@/app/components/back/laptop";
import Hottest from "@/app/sections/trends/components/hottest";
import List from "@/app/sections/trends/components/list";
import { useTrendsStore } from "@/app/store/useTrends";
import { motion } from "framer-motion";

const Laptop = (props: any) => {
  const { handleBuy } = props;

  const { list, allList, top1 } = useTrendsStore();

  const { handleCurrentFilter, currentFilter, handleOrderBy, orderBy } =
    useTrends({ isPolling: false });

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
      <Hottest />
      <List
        currentFilter={currentFilter}
        onCurrentFilter={handleCurrentFilter}
        data={allList}
        orderBy={orderBy}
        onOrderBy={handleOrderBy}
      />
    </motion.div>
  );
};

export default Laptop;
