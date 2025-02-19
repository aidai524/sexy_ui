import styles from './index.module.css';
import clsx from 'clsx';

const MemesTitle = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx(styles.MemesTitleContainer, className)}>
      <div className={styles.MemesTitleIcon}>👑</div>
      <img src="/img/memes/title.svg" alt="" className={styles.MemesTitle} />
    </div>
  );
};

export default MemesTitle;
