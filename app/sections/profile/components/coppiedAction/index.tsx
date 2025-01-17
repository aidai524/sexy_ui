import React, {useState,useEffect, useMemo} from 'react'
import styles from './index.module.css';
import Modal from '@/app/components/modal';
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress } from '@/app/utils';
import {SolIcon} from './icon'
import useSolBalance from '@/app/hooks/use-sol-balance';
import Big from 'big.js';
import {numberFormatter} from '@/app/utils/common'
import Warning from '@/app/components/warning'
import { SHOW_COPY_TRADE } from '@/app/utils/config';

const AmountLevelList = [{key: 0.25}, {key: 0.5}, {key: 0.75}, {key: 1}]

export default function CoppiedAction({show,onClose,copiedInfo}:any) {
  if(!SHOW_COPY_TRADE) return null;
  
  const [copyAmount, setCopyAmount] = useState<string>('')
  const [onceCopyAmount, setOnceCopyAmount] = useState<string>('0.1')
  const [copyTimes, setCopyTimes] = useState<string>('10')
  const [isManualCopyTimes, setIsManualCopyTimes] = useState<boolean>(false)
  const [minCopyAmountTips, setMinCopyAmountTips] = useState<boolean>(false)
  const {solBalance} = useSolBalance()
  const resetForm = () => {
    setMinCopyAmountTips(false);
    setOnceCopyAmount('0.1');
    setCopyTimes('10');
    setCopyAmount('');
    setIsManualCopyTimes(false);
  };


  useEffect(() => {
    if (!solBalance || solBalance === '0' || !show) return
      const solBalanceBig = new Big(solBalance)
      if (solBalanceBig.gte(1)) {
        setCopyAmount('1')
        setOnceCopyAmount(new Big(1).div(copyTimes).toString())
      } else {
        const cpTimes = Math.floor(solBalanceBig.div(0.1).toNumber())
        setCopyTimes(cpTimes.toString())
        setOnceCopyAmount(solBalanceBig.div(cpTimes).toString())
        setCopyAmount(solBalanceBig.toString())
      }
  }, [solBalance,show])

  useEffect(() => {
    if (!copyAmount) return
      const copyAmountBig = new Big(copyAmount)
      setOnceCopyAmount(copyAmountBig.div(copyTimes).toString())
  }, [copyAmount])

  useEffect(() => {
    if (isManualCopyTimes) {
        const copyAmountBig = new Big(copyAmount)
        setOnceCopyAmount(copyAmountBig.div(copyTimes).toString())
    }
  }, [copyTimes])

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const onceCopyAmountMap = useMemo(() => {
    return numberFormatter(onceCopyAmount, 2)
  }, [onceCopyAmount])

  const validateOnceCopyAmount = useMemo(() => {
    const minAmount = 0.1;
    const isAmountTooSmall = +onceCopyAmount < minAmount;

    setMinCopyAmountTips(isAmountTooSmall);
  
    return !isAmountTooSmall && 
      +copyTimes >= 1 && 
      +copyAmount > 0 && 
      +copyAmount <= +solBalance && 
      +solBalance > 0;
  }, [onceCopyAmount, copyTimes, copyAmount, solBalance]);


  const handleCopyAmountChange = (e:any) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCopyAmount(value);
    }
  }

  const handleCopyTimesChange = (e:any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setCopyTimes(value);
      setIsManualCopyTimes(true);
    }
  }

 
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
                <div key={'level'+item.key} onClick={()=>{
                  setCopyAmount((item.key * +solBalance).toString())
                }}>
                  {item.key * 100}% 
                  {index < AmountLevelList.length - 1 && <span className={styles.amountLevelSeparator}>|</span>}
                </div>
              ))}
            </div>
          </div>

          {/* amount input */}
          <div className={styles.amountInput}>
            <div className={`${styles.textWhite} ${styles.amountInputBox}`}>
              <input 
                type="text" 
                placeholder='Enter the amount' 
                value={copyAmount}
                onChange={handleCopyAmountChange}
              />
              <span className={styles.amountIcon}><span>SOL</span> <SolIcon/></span>
            </div>
            <p className={`${styles.amountDetail}  ${styles.textWhite07}`}>
              <span>$20</span>
              <span>Bal: {solBalance} SOL</span>
            </p>
          </div>

          {/* min */}
          <div className={`${styles.min} ${styles.textWhite07}`}>
            <span>Min:&nbsp;</span>
            <div>0.1 SOL</div>
          </div>
          
          {/* your coppies */}
          <div className={`${styles.yourCoppies} ${styles.public} ${styles.textWhite07}`}>
            <span>Your Coppies</span>
            <input 
              type="text" 
              value={copyTimes}
              onChange={handleCopyTimesChange}
            />
          </div>
          
          {/* amount / copy */}
         

          <div className={`${styles.public} ${styles.textWhite07}`}>
            <span>Amount / copy</span>
            <div className={styles.textWhite}>{onceCopyAmountMap.integer + onceCopyAmountMap.decimal} SOL / copy</div>
          </div>
          
          {/* copy button */}
          <button disabled={!validateOnceCopyAmount} className={validateOnceCopyAmount ? styles.copyBtn : styles.copyBtnDisabled}>Copy Trade</button>
        </div>
        {minCopyAmountTips && <Warning warning="Min copy amount must greater or equal to 0.1 Sol" />}
    </Modal>
  )
}
