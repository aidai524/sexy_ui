import React from 'react'
import styles from './index.module.css'

export default function CopyTradeCard() {
  return (
    <div className={styles.container}>
        <span className={styles.title}>Copy Trade</span>
        <span className={styles.copyierAmount}>1000</span>
    </div>
  )
}
