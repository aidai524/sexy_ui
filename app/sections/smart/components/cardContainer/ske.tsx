import { Skeleton } from 'antd-mobile';
import styles from './ske.module.css';
import { useUserAgent } from '@/app/context/user-agent';

const MCopyCardSkeleton = () => {
  const { isMobile } = useUserAgent();
  return (
    <div className={isMobile ? styles.skeletonContainer : styles.skeletonContainerPC}>
     
        <div className={styles.skeletonTitle}>
          <Skeleton animated className={styles.skeletonTitleLabel} />
          <Skeleton animated className={styles.skeletonTitleValue} />
        </div>

        <div className={styles.skeletonContent}>
          <div className={styles.skeletonItem}>
            <Skeleton animated className={styles.skeletonLabel} />
            <Skeleton animated className={styles.skeletonValue} />
          </div>

          <div className={styles.skeletonItem}>
            <Skeleton animated className={styles.skeletonLabel} />
            <Skeleton animated className={styles.skeletonValue} />
          </div>
      </div>
    </div>
  );
};

export default MCopyCardSkeleton;