import styles from './index.module.css';
import SortDirection from '@/app/sections/trends/components/sort';
import { numberFormatter } from '@/app/utils/common';

const List = (props: any) => {
  const { data, currentFilter, onCurrentFilter } = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Filters}>
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
      </div>
      <div className={styles.Table}>
        <div className={styles.TableHeader}>
          <div className={styles.TableRow}>
            <div className={styles.TableCol}>
              Token
            </div>
            <div className={styles.TableCol}>
              Creater
            </div>
            <div className={styles.TableCol}>
              <div>Marketcap</div>
              <SortDirection />
            </div>
            <div className={styles.TableCol}>
              <div>Marketcap %</div>
              <SortDirection />
            </div>
            <div className={styles.TableCol}>
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
          </div>
        </div>
        <div className={styles.TableBody}>
          {
            data.map((item: any, index: number) => (
              <div className={[styles.TableRow, styles.TableRowBody].join(' ')} key={index}>
                <div className={styles.TableCol}>
                  {item.token_symbol}
                </div>
                <div className={styles.TableCol}>
                  {item.created_by || '-'}
                </div>
                <div className={styles.TableCol}>
                  {numberFormatter(item.market_value, 2, true, { prefix: '$', isShort: true })}
                </div>
                <div className={styles.TableCol} style={{ color: index % 2 === 0 ? '#6FFF00' : '#FF378B' }}>
                  +0.37%
                </div>
                <div className={styles.TableCol}>
                  {numberFormatter(item.market_value, 2, true, { prefix: '$', isShort: true })}
                </div>
              </div>
            ))
          }
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
