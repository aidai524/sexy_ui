import React from 'react'
import styles from './index.module.css'

export default function Warning({warning}:{warning:string}) {
  return (
    <div className={styles.CardWarning}>
            <img
              className={styles.CardWarningIcon}
              src="/img/profile/icon-warning.svg"
              alt=""
              width={20}
              height={20}
            />
            <div className={styles.CardWarningText}>
              {warning}
            </div>
  </div>
  )
}
