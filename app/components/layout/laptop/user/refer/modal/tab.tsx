import styles from '@/app/components/layout/laptop/user/refer/modal/index.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Tab = (props: any) => {
  const { isMobile, bg, list } = props;

  const [value, setValue] = useState(25);

  return (
    <motion.div
      className={isMobile ? styles.EarnedMobile : styles.Earned}
      style={{
        backgroundImage: `url("${bg}")`
      }}
      {...AnimateVariants}
    >
      <div className={isMobile ? styles.ProgressMobile : styles.Progress}>
        <motion.div
          className={styles.ProgressValue}
          animate={{ width: `${value}%` }}
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
                  setValue(25);
                }}
              >
                <motion.div
                  className={styles.NodeLabel}
                  animate={{
                    color: item.value === value ? '#FF2681' : '#634F56'
                  }}
                >
                  {item.label}
                </motion.div>
                <AnimatePresence mode="wait">
                  {
                    item.value === value && (
                      <motion.div
                        className={styles.NodeReward}
                        {...AnimateVariants}
                      >
                        <div className={styles.NodeRewardLabel}>
                          <img
                            className={styles.NodeRewardIcon}
                            src="/img/home/refer-checked.svg"
                            alt=""
                          />
                          <div>Earn</div>
                        </div>
                        <div className={styles.NodeRewardContent}>
                          <div className={styles.NodeRewardValue}>{item.amount} {item.unit}</div>
                          <div className={styles.NodeRewardUnit}> / {item.perUnit}</div>
                        </div>
                      </motion.div>
                    )
                  }
                </AnimatePresence>
              </motion.div>
            ))
          }
        </div>
      </div>
    </motion.div>
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
      <div className={styles.EarnedTitleText}>{label}</div>
      <div
        className={
          isMobile
            ? styles.EarnedTitleValueMobile
            : styles.EarnedTitleValue
        }
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
