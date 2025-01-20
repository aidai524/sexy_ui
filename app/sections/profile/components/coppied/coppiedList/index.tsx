import React from 'react'
import styles from './index.module.css'
import CopyItem from './copyItem'

interface CopyListProps {
  copyTradeList: any[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export default function CopyList({ copyTradeList, hasMore, loading, onLoadMore }: CopyListProps) {
  return (
    <div className={styles.ListContainer}>
      {copyTradeList?.map((item: any, index: number) => (
        <CopyItem key={index} itemInfo={item} />
      ))}
      {hasMore && !loading && (
        <div className={styles.LoadMore} onClick={onLoadMore}>
          Load More
        </div>
      )}
    </div>
  )
}
