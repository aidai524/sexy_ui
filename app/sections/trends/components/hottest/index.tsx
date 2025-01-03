import styles from './index.module.css';
import HottestItem from '@/app/sections/trends/components/hottest/item';
import Empty from '@/app/components/empty';

const Hottest = (props: any) => {
  const { data, onBuy } = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        The hottest
      </div>
      <div className={styles.List}>
        {
          data.length > 0 && data.map((it: any, idx: number) => (
            <HottestItem key={idx} index={idx} trend={it} onBuy={onBuy} />
          ))
        }
      </div>
      {
        data.length <= 0 && (
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
    </div>
  );
};

export default Hottest;
