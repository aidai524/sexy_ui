import styles from './index.module.css';
import clsx from 'clsx';
import { IconStopwatch } from '@/app/sections/memes/components/summary-item/icons';

const Countdown = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx(styles.CountdownContainer, className)}>
      <IconStopwatch />
      <div className={styles.CountdownNumber}>
        0 : 23 : 12
      </div>
    </div>
  );
};

export default Countdown;
