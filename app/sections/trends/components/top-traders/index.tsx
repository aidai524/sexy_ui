import React from 'react'
import TopTradersMobile from './m-traders'
import TopTradersPC from './pc-traders'
import { useUserAgent } from '@/app/context/user-agent'
import styles from './index.module.css'
export default function TopTraders() {
  const { isMobile } = useUserAgent()
  return (
    <div className={styles.topTraders}>
     {isMobile ? <TopTradersMobile /> : <TopTradersPC />}
    </div>
  )
}
