import React from 'react'
import styles from './index.module.css'
import RightArrowWrap from '@/app/sections/smart/components/RightArrowWrap'
import Image from 'next/image'
export default function CopyCardEmpty() {
  return (
    <div className={styles.container}>
        <div className={styles.title}>
            <span>Copy Trade</span>
            <span className={styles.copyTradeDescription}>Copy trade from the TOP Traders. Making money and save energy.</span>
            <div className={styles.copyTradeButton}>How it works</div>
        </div>

        <Image src="/img/smart/light.gif" alt="copy-trade-card" width={90} height={90} />
    </div>
  )
}
