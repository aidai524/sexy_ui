import styles from './index.module.css';
import clsx from 'clsx';
import { numberFormatter } from '@/app/utils/common';

const SummaryItem = (props: any) => {
  const { className, type, value } = props;

  return (
    <div className={clsx(styles.SummaryItemContainer, className)}>
      <img src={Config[type].icon} alt="" className="icon" />
      <div className="text">
        {numberFormatter(value, 1, true, { isShort: true, isShortUppercase: true })}
      </div>
    </div>
  );
};

export default SummaryItem;

const Config: any = {
  rocket: {
    icon: '/img/memes/icon-rocket.svg'
  },
  user: {
    icon: '/img/memes/icon-user.svg'
  },
  plane: {
    icon: '/img/memes/icon-plane.svg'
  },
};
