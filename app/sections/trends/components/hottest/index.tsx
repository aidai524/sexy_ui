import styles from './index.module.css';
import HottestItem from '@/app/sections/trends/components/hottest/item';

const Hottest = () => {

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        The hottest
      </div>
      <div className={styles.List}>
        <HottestItem />
        <HottestItem />
        <HottestItem />
        <HottestItem />
        <HottestItem />
        <HottestItem />
      </div>
    </div>
  );
};

export default Hottest;
