import React from 'react'
import styles from './index.module.css'
import TopTraderCard from '@/app/sections/smart/components/mTraderCard'
import CopyTradeCard from '@/app/sections/smart/components/mCopyCard'

export default function CardContainer() {
  const isTopTrader = true;
  return (
    <div className={styles.container + ' ' + (isTopTrader ? styles.topTraderContainer : styles.copyTradeContainer)}>
       {
        isTopTrader ? (
          <>
            <TopTraderCard />
            <CopyTradeCard />
          </>
        ) : (
            <CopyTradeCard />
        )
       }
    </div>
  )
}
