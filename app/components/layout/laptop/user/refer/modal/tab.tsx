import styles from '@/app/components/layout/laptop/user/refer/modal/index.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Tab = (props: any) => {
  const { isMobile, tab, list } = props;

  const [value, setValue] = useState(50);
  const isPointsTab = tab === 2;

  return (
    <div>
      {
        isPointsTab && (
          <div className={styles.ProgressLabel}>
            <div className={styles.ProgressLabelTitle}>
              Refferrals
            </div>
            <div className={styles.ProgressLabelTitle}>
              Yours
            </div>
          </div>
        )
      }
      <motion.div
        className={isMobile ? styles.EarnedMobile : styles.Earned}
        style={{
          marginTop: isPointsTab ? 10 : 30,
        }}
        {...AnimateVariants}
      >
        <div className={isMobile ? styles.ProgressMobile : styles.Progress}>
        <motion.div
            className={styles.ProgressValue}
            animate={{ height: `${value}%` }}
          />
          <div className={styles.NodeList}>
            {
              list.map((item: any) => (
                <motion.div
                  key={item.key}
                  className={item.value >= value ? styles.NodeActive : styles.Node}
                  animate={{
                    backgroundImage: `url("${item.value <= value ? item.iconActive : item.icon}")`
                  }}
                  onMouseEnter={() => {
                    setValue(item.value);
                  }}
                  onMouseLeave={() => {
                    setValue(50);
                  }}
                >
                  <div className={styles.NodeInner}>
                    <div className={styles.NodeLabel}>
                      {item.label}
                    </div>
                    <div className={styles.NodeRewardContent}>
                      <div className={styles.NodeRewardValue}>
                        <span className={styles.NodeRewardValueText}>{item.amount} {item.unit}</span>
                        <span>/</span>
                      </div>
                      <div className={styles.NodeRewardUnit}>{item.perUnit}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Tab;

export const TabTitle = (props: any) => {
  const { isMobile, label, value, unit, onClick, tab, current } = props;

  return (
    <div
      className={isMobile ? styles.EarnedTitleMobile : styles.EarnedTitle}
      onClick={onClick}
      style={{
        cursor: tab === current ? 'default' : 'pointer',
      }}
    >
      <div
        className={styles.EarnedTitleText}
        style={{
          color: tab === current ? 'rgba(0, 0, 0, 0.60)' : 'rgba(255, 255, 255, 0.44)',
        }}
      >
        {label}
      </div>
      <div
        className={
          isMobile
            ? styles.EarnedTitleValueMobile
            : styles.EarnedTitleValue
        }
        style={{
          color: tab === current ? '#000' : '#FFF',
        }}
      >
        {value} {unit}
      </div>
    </div>
  );
};

export const AnimateVariants = {
  variants: {
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
      },
    },
    invisible: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
  },
  initial: 'invisible',
  exit: 'invisible',
  animate: 'visible',
};
