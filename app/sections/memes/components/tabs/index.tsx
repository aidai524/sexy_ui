import { useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Filter, Order, Tab, TABS } from '@/app/sections/memes/config';
import { AnimatePresence, motion } from 'framer-motion';
import TokenItem, { TokenItemLoading } from '@/app/sections/memes/components/token-item';
import { MemesContext } from '@/app/sections/memes/context';
import { Hot, Meme } from '@/app/sections/memes/store/list';
import Empty from '@/app/components/empty';
import SexInfiniteScroll from '@/app/components/sexInfiniteScroll';
import { useUserAgent } from '@/app/context/user-agent';
import MemesSelect from '@/app/sections/memes/components/select';

const MemesTabs = (props: any) => {
  const { className } = props;
  const { isMobile } = useUserAgent();
  const {
    hotListLoading,
    memesListLoading,
    memesListPageNext,
    onMemesListNextPage,
    initMemesList,
    list,
    currentTab,
    setCurrentTab,
    setPrevTab,
    currentFilter,
    setCurrentFilter,
    getHotList,
    getMemesList,
  } = useContext(MemesContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: Tab) => {
    setPrevTab?.(currentTab);
    setCurrentTab?.(tab);
    if (tab.filters?.length) {
      setCurrentFilter?.(tab.filters[0]);
    } else {
      setCurrentFilter?.(void 0);
    }
    if (tab.value === TABS[0].value) {
      getHotList?.();
      return;
    }
    initMemesList?.();
    getMemesList?.({
      type: tab.value,
      offset: 0,
      sort: tab.filters?.[0].value,
      order: tab.filters?.[0].order,
    });
  };

  const handleFilter = (filter: Filter) => {
    let _order = filter.order;
    if (filter.value === currentFilter?.value) {
      if (currentFilter?.order === Order.Desc) {
        setCurrentFilter?.({
          ...filter,
          order: Order.Asc,
        });
        _order = Order.Asc;
      } else {
        setCurrentFilter?.({
          ...filter,
          order: Order.Desc,
        });
        _order = Order.Desc;
      }
    } else {
      setCurrentFilter?.({ ...filter });
    }
    if (currentTab?.value === TABS[0].value) {
      return;
    }
    initMemesList?.();
    getMemesList?.({
      type: currentTab?.value,
      offset: 0,
      sort: filter.value,
      order: _order,
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeTab = container?.querySelector(`[data-tab="${currentTab?.value}"]`) as HTMLElement;

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
            const isActive = currentTab?.value === tab.value;

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
        {
          (!isMobile && !!currentTab?.filters?.length) && (
            <MemesSelect
              value={currentFilter}
              options={currentTab?.filters}
              onChange={handleFilter}
              renderSelectedLabel={() => (
                <div className={styles.MemesTabsFilterDropdownSelected}>
                  <div className={styles.MemesTabsFilterDropdownLabel}>
                    {currentFilter?.label}
                  </div>
                  <OrderArrow order={currentFilter?.order} />
                </div>
              )}
              renderLabel={(item: any) => (
                <div className={styles.MemesTabsFilterDropdown}>
                  <div className={styles.MemesTabsFilterDropdownLabel}>
                    {item?.label}
                  </div>
                  <OrderArrow order={item.value === currentFilter?.value ? currentFilter?.order : item.order} />
                </div>
              )}
            />
          )
        }
      </motion.div>
      <motion.div
        className={clsx(styles.MemesTabsContent)}
      >
        {
          (!!currentTab?.filters?.length && isMobile) && (
            <div className={styles.MemesTabsFilters}>
              {
                currentTab.filters.map((f) => (
                  <div
                    className={clsx(currentFilter?.value === f.value ? styles.MemesTabsFilterActive : styles.MemesTabsFilter)}
                    key={f.value}
                    onClick={() => handleFilter(f)}
                  >
                    <div>{f.label}</div>
                    {
                      (currentFilter && currentFilter?.value === f.value) && (
                        <OrderArrow order={currentFilter?.order} />
                      )
                    }
                  </div>
                ))
              }
            </div>
          )
        }
        <div
          className={styles.MemesTabsList}
          // style={{
          //   maxHeight: !!currentTab?.filters?.length ? 'calc(100dvh - 440px)' : 'calc(100dvh - 412px)',
          // }}
        >
          {
            (hotListLoading || ((!list || list.length < 1) && memesListLoading)) ? (
              <div className={styles.MemesTabsListInner}>
                <TokenItemLoading key={1} />
                <TokenItemLoading key={2} />
                <TokenItemLoading key={3} />
                <TokenItemLoading key={4} />
                <TokenItemLoading key={5} />
              </div>
            ) : (
              (!list || list.length < 1) ? (
                <Empty height={300} text="No Data" />
              ) : (
                <>
                  <div className={styles.MemesTabsListInner}>
                    {
                      list?.map?.((item: Hot | Meme, index: number) => (
                        <TokenItem key={index} token={item} />
                      ))
                    }
                  </div>
                  {
                    currentTab?.value !== TABS[0].value && (
                      <>
                        <SexInfiniteScroll
                          loadMore={onMemesListNextPage}
                          hasMore={memesListPageNext}
                        />
                        {
                          !memesListPageNext && (
                            <div className={styles.MemesTabsNoMoreData}>No more data</div>
                          )
                        }
                      </>
                    )
                  }
                </>
              )
            )
          }
        </div>
      </motion.div>
    </div>
  );
};

export default MemesTabs;

const OrderArrow = (props: any) => {
  const { className, order } = props;

  return ((order === Order.Asc) ? (
    <img
      src="/img/memes/icon-arrow-up.svg"
      alt=""
      className={clsx(styles.MemesTabsFilterArrow, className)}
    />
  ) : (
    <img
      src="/img/memes/icon-arrow-up.svg"
      alt=""
      className={clsx(styles.MemesTabsFilterArrowDown, className)}
    />
  ));
};
