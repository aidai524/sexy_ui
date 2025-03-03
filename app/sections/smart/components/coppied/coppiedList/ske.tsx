import React from 'react';
import { Skeleton } from 'antd-mobile';
import styles from './ske.module.css';
import { useUserAgent } from '@/app/context/user-agent';

export const CopyItemSkeleton = () => {
  const { isMobile } = useUserAgent();
  return (
    <div className={styles.ItemBoxContainer}>
        {
            [1,2,3].map((item:any)=> (
                <div key={item} className={ isMobile ? styles.ItemBox : styles.ItemBoxPC}>
                    <div className={styles.ItemBoxTop}>
                        <div className={styles.ItemBoxTopLeft}>
                            <Skeleton className={styles.avatar} />
                            <Skeleton className={styles.name} />
                        </div>
                        <Skeleton className={styles.right} />
                    </div>
                    <div className={styles.ItemBoxBottom}>
                        <Skeleton className={styles.bottom} />
                        <Skeleton className={styles.bottom} />
                    </div>
                    <div className={styles.ItemBoxBottom}>
                        <Skeleton className={styles.bottom} />
                        <Skeleton className={styles.bottom} />
                    </div>
                </div>
            ))
        }
    </div>
  );
};