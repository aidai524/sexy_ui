import styles from './index.module.css';
import { numberFormatter } from '@/app/utils/common';

const Summaries = (props: any) => {
  const {} = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Inner}>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>
            7D PNL
          </div>
          <div className={[styles.SummaryValue, styles.SummaryValueBuy].join(' ')}>
            +{numberFormatter(364.158, 2, true, { prefix: '$', isShort: true })}
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>
            7D Win Rate
          </div>
          <div className={[styles.SummaryValue].join(' ')}>
            {numberFormatter(450.58, 1, true, { isShort: true })}%
          </div>
        </div>
        <div className={styles.Summary}>
          <div className={styles.SummaryLabel}>
            Buy/Sell
          </div>
          <div className={[styles.SummaryValue].join(' ')}>
            <div className={[styles.SummaryValueBuy].join(' ')}>
              {numberFormatter(40, 0, true, { isShort: true })}
            </div>
            <div className={[].join(' ')}>
              /
            </div>
            <div className={[styles.SummaryValueSell].join(' ')}>
              {numberFormatter(22, 0, true, { isShort: true })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summaries;
