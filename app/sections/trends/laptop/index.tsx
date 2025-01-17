"use client";

import styles from "./index.module.css";
import Top from "@/app/sections/trends/components/top";
import { motion } from "framer-motion";
import Item from "@/app/sections/trends/components/item";
import { useTrends } from "@/app/sections/trends/hooks";
import { useEffect } from "react";
import TrendsLoading from "@/app/sections/trends/components/loading";

export default function Mobile(props: any) {
  const { handleBuy } = props;

  const { hottestList, tableList, top1, getAllList, allListLoading } =
    useTrends();

  useEffect(() => {
    getAllList();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Wrapper}
    >
      <div className={styles.TitleWrapper}>
        <span>Trends</span>
      </div>
      <div className={styles.Container}>
        <div className={styles.Box}>
          <Top
            onBuy={() => handleBuy(top1)}
            trend={top1}
            isMobile={false}
            loading={allListLoading}
          />
          <div className={styles.ListTitle}>Hot Memes</div>
          <div className={styles.List}>
            {allListLoading ? (
              <TrendsLoading />
            ) : (
              <>
                {[...hottestList, ...tableList].map((item) => (
                  <Item
                    key={item.id}
                    onBuy={() => handleBuy(item)}
                    trend={item}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
