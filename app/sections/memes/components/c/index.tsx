import styles from './index.module.css';
import clsx from 'clsx';

const Component = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx(styles.Container, className)}></div>
  );
};

export default Component;
