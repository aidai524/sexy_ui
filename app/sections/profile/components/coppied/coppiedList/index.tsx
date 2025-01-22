import React from 'react'
import styles from './index.module.css'
import CopyItem from './copyItem'
import CopyItemPc from './copyItemPc'
import { useUserAgent } from '@/app/context/user-agent'

interface CopyListProps {
  copyTradeList: any[];
}

export default function CopyList({ copyTradeList}: CopyListProps) {
  const { isMobile } = useUserAgent();
  return (
    <div className={isMobile ? styles.ListContainer : styles.ListContainerPc}>
      {copyTradeList?.map((item: any, index: number) => (
        isMobile ? <CopyItem key={index} itemInfo={item} /> : <CopyItemPc key={index} itemInfo={item} />
      ))}
    </div>
  )
}
