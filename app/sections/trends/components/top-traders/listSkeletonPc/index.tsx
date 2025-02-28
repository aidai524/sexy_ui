import React from 'react'
import styles from './index.module.css'
import { Skeleton } from 'antd-mobile'

export default function ListSkeletonPc() {
    return (
      <div className={styles.traderList}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className={styles.traderItem}>
            <div className={styles.traderInfo}>
              <div className={styles.avatar}>
                <Skeleton animated className={styles.avatarSkeleton} />
              </div>
              <div className={styles.nameWrapper}>
                <Skeleton animated className={styles.nameSkeleton} />
                <Skeleton animated className={styles.subNameSkeleton} />
              </div>
            </div>
            <div className={styles.pnl}>
              <Skeleton animated className={styles.pnlValueSkeleton} />
              <Skeleton animated className={styles.pnlSubValueSkeleton} />
            </div>
            <div className={styles.pnl}>
              <Skeleton animated className={styles.pnlValueSkeleton} />
              <Skeleton animated className={styles.pnlSubValueSkeleton} />
            </div>
            <div className={styles.pnl}>
              <Skeleton animated className={styles.pnlValueSkeleton} />
              <Skeleton animated className={styles.pnlSubValueSkeleton} />
            </div>
            <div className={styles.copingContainer}>
              <Skeleton animated className={styles.copingButtonSkeleton} />
            </div>
          </div>
        ))}
      </div>
    );
  };
