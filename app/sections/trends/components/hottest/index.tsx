import styles from './index.module.css';
import HottestItem from '@/app/sections/trends/components/hottest/item';

const Hottest = (props: any) => {
  const { data, onBuy } = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        The hottest
      </div>
      <div className={styles.List}>
        {
          data.map((it: any, idx: number) => (
            <HottestItem key={idx} index={idx} trend={it} onBuy={onBuy} />
          ))
        }
      </div>
    </div>
  );
};

export default Hottest;
