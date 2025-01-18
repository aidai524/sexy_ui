import React from 'react'
import styles from './index.module.css'
import CopyItem from './copyItem'
export default function CopyList({coppiedList}: any) {
  return (
    <div className={styles.ListContainer}>
      {coppiedList.map((item: any, index: any) => (
        <CopyItem key={index} itemInfo={item} />
      ))}
    </div>
  )
}
