import React from 'react'
import styles from './index.module.css'
import TopTraderCard from '@/app/sections/smart/components/mTraderCard'
import CopyTradeCard from '@/app/sections/smart/components/mCopyCard'
import CopyCardEmpty from '@/app/sections/smart/components/mCopyCardEmpty'

export default function CardContainer() {
  const isTopTrader = true;
  const isCopyier = true;
  return (
    <div className={styles.container + ' ' + (isTopTrader ? styles.topTraderContainer : styles.copyTradeContainer)}>
       {
        isTopTrader ? (
          <>
            <TopTraderCard />
            {
              isCopyier ? (
                <CopyTradeCard />
              ) : (
                <CopyCardEmpty />
              )
            }
          </>
        ) : (
           isCopyier ? (
            <CopyTradeCard />
           ) : (
            <CopyCardEmpty />
           )
        )
       }
    </div>
  )
}
