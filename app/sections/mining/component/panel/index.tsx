import styles from "./index.module.css";
import clsx from 'clsx';

const Panel = (props: any) => {
  const { className, isTape, children } = props;

  return (
    <div className={clsx(styles.PanelContainer, className)}>
      {
        isTape && (
          <img src="/img/mining/tape.svg" alt="" className={styles.PanelTape} />
        )
      }
      {children}
    </div>
  );
};

export default Panel;
