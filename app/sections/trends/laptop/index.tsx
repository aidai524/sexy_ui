import styles from './index.module.css';
import Top from '@/app/sections/trends/components/top';
import { useTrends } from '@/app/sections/trends/hooks';
import GoBack from '@/app/components/back/laptop';

const Laptop = (props: any) => {
  const { handleBuy } = props;

  const { list, top1 } = useTrends();

  return (
    <div className={styles.Container}>
      <GoBack />
      <Top onBuy={() => handleBuy(top1)} trend={top1} />
    </div>
  );
};

export default Laptop;
