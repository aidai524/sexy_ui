"use client";

import styles from "./index.module.css";
import Top from "@/app/sections/trends/components/top";
import { motion } from "framer-motion";
import Item from "@/app/sections/trends/components/item";
import { useTrends } from "@/app/sections/trends/hooks";
import { useEffect } from "react";
import TrendsLoading from "@/app/sections/trends/components/loading";
import Tab from "@/app/components/tab";
import TopTraders from "@/app/sections/trends/components/top-traders";

export default function Mobile(props: any) {
  const { handleBuy } = props;

  const { hottestList, tableList, top1, getAllList, allListLoading } =
    useTrends();

  const tabNotes = [
    {
      name: "Hot Memes",
      content:   <div className={styles.Container}>
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
    },
    {
      name: "Top Traders",
      content: <TopTraders />
    }
  ]

  

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
      <Tab nodes={tabNotes} activeNode={tabNotes[0].name}/>
    </motion.div>
  );
}
