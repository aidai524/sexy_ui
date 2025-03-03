import React from 'react';
import { Skeleton } from 'antd-mobile';
import styles from './index.module.css';

const ListSkeleton = () => {
  return (
    <div className={styles.container}>
      {[...Array(10)].map((item) => (
        <div key={item} className={styles.skeletonCard}>
          <div className={styles.mainContent}>
            {/* Left side - Avatar and name area */}
            <div className={styles.leftContent}>
              <Skeleton className={styles.avatar} />
              <div className={styles.textArea}>
                <Skeleton animated className={styles.nameBlock} />
                <Skeleton animated className={styles.followersBlock} />
              </div>
            </div>
            
            {/* Right side - Metrics */}
            <div className={styles.metrics}>
              <Skeleton animated className={styles.metricsBlock} />
            </div>
          </div>

          {/* Copy button */}
          <div className={styles.copyButton}>
            <Skeleton animated className={styles.copyButtonBlock} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;