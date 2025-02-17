import { useEffect, useRef } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { TABS } from '@/app/sections/memes/config';
import { useMemesStore } from '@/app/sections/memes/store';
import { AnimatePresence, motion } from 'framer-motion';

const MemesTabs = (props: any) => {
  const { className } = props;
  const { currentTab, setCurrentTab, prevTab, setPrevTab } = useMemesStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: number) => {
    setPrevTab(currentTab);
    setCurrentTab(tab);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeTab = container?.querySelector(`[data-tab="${currentTab}"]`) as HTMLElement;

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
            const isActive = currentTab === tab.value;
            const direction = Number(currentTab) > Number(prevTab) ? 1 : -1;

            return (
              <div
                key={tab.value}
                data-tab={tab.value}
                className={clsx(styles.tab, currentTab === tab.value && styles.tabActive)}
                onClick={() => handleTabClick(tab.value)}
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
    </div>
  );
};

export default MemesTabs;
