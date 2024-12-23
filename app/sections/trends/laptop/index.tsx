import styles from './index.module.css';
import Top from '@/app/sections/trends/components/top';
import { useTrends } from '@/app/sections/trends/hooks';
import GoBack from '@/app/components/back/laptop';
import Hottest from '@/app/sections/trends/components/hottest';
import List from '@/app/sections/trends/components/list';

const Laptop = (props: any) => {
  const { handleBuy } = props;

  const { list, allList, top1, handleCurrentFilter, currentFilter } = useTrends();

  return (
    <div className={styles.Container}>
      <GoBack />
      <Top onBuy={() => handleBuy(top1)} trend={top1} />
      <Hottest />
      <List
        currentFilter={currentFilter}
        onCurrentFilter={handleCurrentFilter}
        data={allList}
      />
    </div>
  );
};

export default Laptop;
