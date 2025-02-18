import { useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Filter, Tab, TABS } from '@/app/sections/memes/config';
import { useMemesStore } from '@/app/sections/memes/store';
import { AnimatePresence, motion } from 'framer-motion';
import TokenItem from '@/app/sections/memes/components/token-item';
import { MemesContext } from '@/app/sections/memes/context';

const MemesTabs = (props: any) => {
  const { className } = props;
  const { allList: data = [] } = useContext(MemesContext);
  const {
    currentTab,
    setCurrentTab,
    prevTab,
    setPrevTab,
    currentFilter,
    setCurrentFilter,
  } = useMemesStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: Tab) => {
    setPrevTab(currentTab);
    setCurrentTab(tab);
    if (tab.filters?.length) {
      setCurrentFilter(tab.filters[0]);
    } else {
      setCurrentFilter(void 0);
    }
  };

  const handleFilter = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeTab = container?.querySelector(`[data-tab="${currentTab.value}"]`) as HTMLElement;

    if (container && activeTab) {
      const containerWidth = container.offsetWidth;
      const tabOffset = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;

      const targetScroll = tabOffset - (containerWidth / 2) + (tabWidth / 2);

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [currentTab]);

  return (
    <div className={clsx(styles.MemesTabsContainer, className)}>
      <motion.div
        ref={scrollContainerRef}
        className={styles.MemesTabsHeader}
      >
        <div
          ref={containerRef}
          className={styles.tabsInner}
        >
          {TABS.map((tab, index) => {
            const isActive = currentTab.value === tab.value;
            const direction = Number(currentTab.value) > Number(prevTab.value) ? 1 : -1;

            return (
              <div
                key={tab.value}
                data-tab={tab.value}
                className={clsx(styles.tab, isActive && styles.tabActive)}
                onClick={() => handleTabClick(tab)}
              >
                <div className={styles.tabInner}>
                  {tab.icon && (
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      width={tab.iconSize || 16}
                      height={tab.iconSize || 16}
                      className={styles.tabIcon}
                    />
                  )}
                  {tab.label}
                </div>
                <AnimatePresence mode="wait">
                  {
                    isActive && (
                      <motion.div
                        className={styles.indicator}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    )
                  }
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
      <motion.div
        className={clsx(styles.MemesTabsContent)}
      >
        {
          !!currentTab.filters?.length && (
            <div className={styles.MemesTabsFilters}>
              {
                currentTab.filters.map((f) => (
                  <div
                    className={clsx(currentFilter?.value === f.value ? styles.MemesTabsFilterActive : styles.MemesTabsFilter)}
                    key={f.value}
                    onClick={() => handleFilter(f)}
                  >
                    {f.label}
                  </div>
                ))
              }
            </div>
          )
        }
        <div className={styles.MemesTabsList}>
          {
            data.map((item: any, index: any) => (
              <TokenItem key={index} token={item} />
            ))
          }
        </div>
      </motion.div>
    </div>
  );
};

export default MemesTabs;
