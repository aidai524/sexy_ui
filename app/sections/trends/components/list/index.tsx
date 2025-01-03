import styles from './index.module.css';
import SortDirection from '@/app/sections/trends/components/sort';
import { numberFormatter } from '@/app/utils/common';
import { useCreator } from '@/app/sections/trends/hooks/creator';
import Empty from '@/app/components/empty';
import InfiniteScrollContent from '@/app/components/infinite-scroll-content';
import { InfiniteScroll } from 'antd-mobile';

const List = (props: any) => {
  const {
    data,
    orderBy,
    onOrderBy,
    onSearchText,
    onSearchTextClear,
    searchText,
    getTableList,
    tableListPageMore,
    tableListPageIndex,
  } = props;

  const creator = useCreator();

  return (
    <div className={styles.Container}>
      {/*<div className={styles.Filters}>
        {
          SpacingList.map((s) => (
            <div
              key={s.value}
              className={`${currentFilter === s.value ? styles.FilterActive : styles.Filter}`}
              onClick={() => onCurrentFilter(s.value)}
            >
              {s.label}
            </div>
          ))
        }
      </div>*/}
      <div className={styles.TableConditions}>
        <div className={styles.TableSearch}>
          <div className={styles.TableSearchLeft}>
            <img src="/img/trends/search.svg" alt="" className={styles.TableSearchIcon} />
            <input value={searchText} type="text" className={styles.TableSearchInput} onInput={onSearchText} />
          </div>
          <button
            type="button"
            className={styles.TableSearchRight}
            onClick={onSearchTextClear}
          >
            <img src="/img/trends/close.svg" alt="" className={styles.TableSearchClose} />
          </button>
        </div>
      </div>
      <div className={styles.Table}>
        <div className={styles.TableHeader}>
          <div className={[styles.TableRow, styles.TableRowHeader].join(' ')}>
            <div className={styles.TableCol}>
              Token
            </div>
            <div className={styles.TableCol}>
              Creater
            </div>
            <div
              className={[styles.TableCol, styles.TableColPointer].join(' ')}
              onClick={() => onOrderBy('market_cap')}
            >
              <div>Marketcap</div>
              <SortDirection value={'market_cap' in orderBy ? orderBy['market_cap'] : void 0} />
            </div>
            <div className={styles.TableCol}>
              Progress
            </div>
            {/*<div
             className={[styles.TableCol, styles.TableColPointer].join(' ')}
             onClick={() => onOrderBy('market_cap_percentage')}
             >
             <div>Marketcap %</div>
             <SortDirection value={'market_cap_percentage' in orderBy ? orderBy['market_cap_percentage'] : void 0} />
             </div>*/}
            {/*<Popover
             placement={PopoverPlacement.TopRight}
             trigger={PopoverTrigger.Hover}
             content={(
             <div className={styles.Dropdown}>
             {
             SpacingList.map((s) => (
             <div
             key={s.value}
             className={`${currentFilter === s.value ? styles.DropdownItemActive : styles.DropdownItem}`}
             onClick={() => onCurrentFilter(s.value)}
             >
             {s.label}
             </div>
             ))
             }
             </div>
             )}
             >
             <div className={[styles.TableCol, styles.TableColPointer].join(' ')}>
             <div>1h Volume</div>
             <button
             type="button"
             className={styles.Button}
             >
             <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path
             d="M10.9999 1L6.1999 5L1.3999 1"
             stroke="white"
             strokeWidth="1.5"
             strokeLinecap="round"
             strokeLinejoin="round"
             />
             </svg>
             </button>
             </div>
             </Popover>*/}
          </div>
        </div>
        <div
          className={styles.TableBody}
          style={{
            background: data.length > 0 ? '' : 'rgba(0, 0, 0, 0.08)',
            padding: data.length > 0 ? '' : '80px 0',
          }}
        >
          {
            data.length > 0 ? data.map((item: any, index: number) => (
              <div className={[styles.TableRow, styles.TableRowBody].join(' ')} key={index}>
                <div className={styles.TableCol}>
                  <img src={item.Icon} alt="" className={styles.TokenImg} />
                  <div>{item.token_symbol}</div>
                </div>
                <div
                  className={styles.TableCol}
                  style={{ cursor: 'pointer', color: '#55FFF4', fontSize: 16 }}
                  onClick={() => {
                    creator.onClick(item.project_creator);
                  }}
                >
                  {item.address ? `${item.project_creator.slice(0, 3)}*${item.address.slice(-4)}` : '-'}
                </div>
                <div className={styles.TableCol}>
                  {numberFormatter(item.market_cap, 2, true, { prefix: '$', isShort: true })}
                </div>
                <div className={styles.TableCol}>
                  {item.progress}%
                </div>
                {/*<div className={styles.TableCol} style={{ color: index % 2 === 0 ? '#6FFF00' : '#FF378B' }}>
                 +{item.market_cap_percentage}%
                 </div>*/}
                {/*<div className={styles.TableCol}>
                 {numberFormatter(item.virtual_volume, 2, true, { prefix: '$', isShort: true })}
                 </div>*/}
              </div>
            )) : (
              <Empty
                text="No Data"
                icon="/img/trends/empty.svg"
                textStyle={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: '#9290B1',
                }}
              />
            )
          }
          <InfiniteScroll
            loadMore={() => {
              return getTableList({ pageIndex: tableListPageIndex });
            }}
            hasMore={tableListPageMore}
          >
            <InfiniteScrollContent hasMore={tableListPageMore} text=" " />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default List;

const SpacingList = [
  { value: 1, label: '1h' },
  { value: 6, label: '6h' },
  { value: 12, label: '12h' },
];
