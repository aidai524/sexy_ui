import React from 'react'
import styles from './index.module.css'
import CopyItem from './copyItem'
import CopyItemPc from './copyItemPc'
import { useUserAgent } from '@/app/context/user-agent'

interface CopyListProps {
  copyTradeList: any[];
  handleCloseCopyTrade: (item: any) => void;
  isCloseCopyTradeLoading: boolean;
  handleCloseAndSell: (item: any) => void;
  handleClose: (item: any) => void; 
  urlAddress: string;
}

export default function CopyList({ copyTradeList, handleCloseCopyTrade, isCloseCopyTradeLoading,handleCloseAndSell, handleClose , urlAddress}: CopyListProps) {
  const { isMobile } = useUserAgent();
  return (
    <div className={isMobile ? styles.ListContainer : styles.ListContainerPc}>
      {copyTradeList?.map((item: any, index: number) => (
        isMobile ? 
        <CopyItem urlAddress={urlAddress} key={index} itemInfo={item} handleCloseCopyTrade={handleCloseCopyTrade} isCloseCopyTradeLoading={isCloseCopyTradeLoading} /> : 
        <CopyItemPc urlAddress={urlAddress} key={index} itemInfo={item} handleCloseCopyTrade={handleCloseCopyTrade} isCloseCopyTradeLoading={isCloseCopyTradeLoading} handleCloseAndSell={handleCloseAndSell} handleClose={handleClose} />
      ))}
    </div>
  )
}
