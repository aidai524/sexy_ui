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
import { SHOW_COPY_TRADE } from "@/app/utils/config";
import { useTrendsTab } from "@/app/store/useTrendsTab";

export default function Mobile(props: any) {
  const { handleBuy } = props;
  const trendsTabStore: any = useTrendsTab();

  const { hottestList, tableList, top1, getAllList, allListLoading } =
    useTrends();

  const hotMemesContent = (
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
              {[...hottestList, ...tableList].map((item, index) => (
                <Item
                  key={item.id}
                  onBuy={() => handleBuy(item)}
                  trend={item}
                  index={index}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const tabNotes = [
    {
      name: "Hot Memes",
      content: hotMemesContent
    },
   {
      name: "Top Traders",
      content: <TopTraders />
    }
  ];

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
      {SHOW_COPY_TRADE ? <Tab 
       onTabChange={(nodeName: string) => {
        trendsTabStore.set({
          profileTabName: nodeName
        });
      }}
      activeNode={trendsTabStore.profileTabName}
      nodes={tabNotes} useExtraClass={true} /> : hotMemesContent}
    </motion.div>
  );
}
