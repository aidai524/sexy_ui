import React, {useState} from 'react'
import styles from './index.module.css';
import Modal from '@/app/components/modal';
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress } from '@/app/utils';
import {SolIcon} from './icon'
import { useTokenTrade } from '@/app/hooks/useTokenTrade';

const AmountLevelList = [{
  key: 0.25,
}, {
  key: 0.5,
}, 
{
  key: 0.75,
},
{
  key: 1,
}]


export default function CoppiedAction({show,onClose,copiedInfo}:any) {
  const [copyAmount, setCopyAmount] = useState<number | string>(1)
  const [minCopyAmount, setMinCopyAmount] = useState<number | string>(0.1)
  const [copyTimes, setCopyTimes] = useState<number | string>(10)
  
  

  return (
    <Modal 
        open={show}
        onClose={onClose}
        animation="popup"
        closeStyle={{ display: "none" }}
    >
        <div className={styles.main}>
         
          {/* copyied info */}
          <img className={styles.avatar} src={copiedInfo?.icon || defaultAvatar} alt="" />
          <div className={styles.userName}>Copy @{copiedInfo?.name || formatAddress(copiedInfo?.address) || 'FlipN'}</div>
         
          {/* amount */}
          <div className={`${styles.amount} ${styles.public} ${styles.textWhite07}`}>
            <span>Amount</span>
            <div className={styles.amountLevel}>
              {AmountLevelList.map((item,index)=>(
                <div key={'level'+item.key}>
                  {item.key * 100}% 
                  {index < AmountLevelList.length - 1 && <span className={styles.amountLevelSeparator}>|</span>}
                </div>
              ))}
            </div>
          </div>

          {/* amount input */}
          <div className={styles.amountInput}>
            <div className={`${styles.textWhite} ${styles.amountInputBox}`}>
              <input type="text" placeholder='Enter the amount' value={copyAmount}/>
              <span className={styles.amountIcon}><span>SOL</span> <SolIcon/></span>
            </div>
            <p className={`${styles.amountDetail}  ${styles.textWhite07}`}>
              <span>$20</span>
              <span>Bal: 1 SOL</span>
            </p>
          </div>

          {/* min */}
          <div className={`${styles.min} ${styles.textWhite07}`}>
            <span>Min:&nbsp;</span>
            <div>{minCopyAmount} SOL / copy</div>
          </div>
          
          {/* your coppies */}
          <div className={`${styles.yourCoppies} ${styles.public} ${styles.textWhite07}`}>
            <span>Your Coppies</span>
            <input type="text" value={copyTimes}/>
          </div>
          
          {/* amount / copy */}
          <div className={`${styles.public} ${styles.textWhite07}`}>
            <span>Amount / copy</span>
            <div className={styles.textWhite}>0.1 SOL</div>
          </div>
          
          {/* copy button */}
          <button className={styles.copyBtn}>Copy Trade</button>
        </div>
    </Modal>
  )
}
