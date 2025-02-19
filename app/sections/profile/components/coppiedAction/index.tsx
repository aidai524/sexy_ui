import React, { useState, useEffect, useMemo,useRef } from "react";
import styles from "./index.module.css";
import Modal from "@/app/components/modal";
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress } from "@/app/utils";
import { formatLongText } from "@/app/utils/common";
import useSolBalance from "@/app/hooks/use-sol-balance";
import useSolPrice from "@/app/hooks/use-sol-price";
import Big from "big.js";
import { numberFormatter } from "@/app/utils/common";
import Warning from "@/app/components/warning";
import CopyTrade from "@/app/services/copyTrade";
import { useAuth } from "@/app/context/auth";
import MainBtn from "@/app/components/mainBtn";
import { fail, success } from "@/app/utils/toast";
import { useCopyTrade } from "@/app/sections/profile/hooks/useCreateCopyTrade";
import { Switch } from "antd-mobile";

const AmountLevelList = [
  { key: 0.25 },
  { key: 0.5 },
  { key: 0.75 },
  { key: 1 }
];

export default function CoppiedAction({ show, onClose, copiedInfo }: any) {
  const { isLoading, handleCopyTrade } = useCopyTrade();
  const { userInfo: currentUserInfo } = useAuth();
  const [copyAmount, setCopyAmount] = useState<string>("");
  const [onceCopyAmount, setOnceCopyAmount] = useState<string>("0.1");
  const [copyTimes, setCopyTimes] = useState<string>("10");
  const [isManualCopyTimes, setIsManualCopyTimes] = useState<boolean>(false);
  const [minCopyAmountTips, setMinCopyAmountTips] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { solBalance } = useSolBalance(Number(show) + (isLoading ? 1 : 0));
  const { solPrice } = useSolPrice();
  const resetForm = () => {
    setMinCopyAmountTips(false);
    setOnceCopyAmount("0.1");
    setCopyTimes("10");
    setCopyAmount("");
    setIsManualCopyTimes(false);
  };
  const commonButtonStyle = {
    height: "50px",
    borderRadius: "30px",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "normal",
    border: "2px solid #FBCA04",
    background: "#FBCA04",
    color: "#000",
    marginTop: "24px"
  };

  useEffect(() => {
    if (!solBalance || solBalance === "0" || !show) return;
    const solBalanceBig = new Big(solBalance);
    if (solBalanceBig.gte(1)) {
      setCopyAmount("1");
      setOnceCopyAmount(new Big(1).div(copyTimes).toString());
    } else if (solBalanceBig.gte(0)) {
      const cpTimes = Math.floor(solBalanceBig.div(0.1).toNumber());
      if (cpTimes <= 0) {
        setCopyTimes("1");
        setOnceCopyAmount(solBalanceBig.toString());
      } else {
        setCopyTimes(cpTimes.toString());
        setOnceCopyAmount(solBalanceBig.div(cpTimes).toString());
      }
      const roundedAmount = new Big(Math.floor(solBalanceBig.div(0.1).toNumber())).mul(0.1).toString();
      setCopyAmount(roundedAmount);
    }
  }, [solBalance, show]);

  useEffect(() => {
    if (!copyAmount) return;
    const copyAmountBig = new Big(copyAmount || 0);
    setOnceCopyAmount(copyAmountBig.div(copyTimes).toString());
    // const cpTimes = Math.floor(copyAmountBig.div(0.1).toNumber()) > 10 ? 10 : Math.floor(copyAmountBig.div(0.1).toNumber());
    // if (cpTimes <= 0) {
    //   setCopyTimes("1");
    // } else {
    //   setCopyTimes(cpTimes.toString());
    // }
    // setOnceCopyAmount(copyAmountBig.toString());
  }, [copyAmount]);

  useEffect(() => {
    if (isManualCopyTimes && copyTimes && copyTimes != "0") {
      const copyAmountBig = new Big(copyAmount || 0);
      setOnceCopyAmount(copyAmountBig.div(copyTimes || 1).toString());
    }
  }, [copyTimes]);

  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!show) {
      resetForm();
    }
    viewportMeta?.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no');
  }, [show]);

  const onceCopyAmountMap = useMemo(() => {
    return numberFormatter(onceCopyAmount, 2);
  }, [onceCopyAmount]);

  const validateOnceCopyAmount = useMemo(() => {
    const minAmount = 0.1;
    const isAmountTooSmall = +onceCopyAmount < minAmount;
    setMinCopyAmountTips(isAmountTooSmall);

    return (
      !isAmountTooSmall &&
      +copyTimes >= 1 &&
      +copyAmount > 0 &&
      +copyAmount <= +solBalance &&
      +solBalance > 0
    );
  }, [onceCopyAmount, copyTimes, copyAmount, solBalance]);

  const handleCopyAmountChange = (e: any) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setCopyAmount(value);
    }
  };

  const handleCopyTimesChange = (e: any) => {
    const value = e.target.value;
    if ((/^\d*$/.test(value) || value === "") && !/^0\d+/.test(value)) {
      setCopyTimes(value);
      setIsManualCopyTimes(true);
    }
  };

  const handleSetClick = () => {
    setIsInputDisabled(false);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(copyTimes.length, copyTimes.length);
    }, 0);
  };

  const handleCopyTradeClick = async () => {
    if (!window.sexAddress) {
      window.connect();
      return;
    }
   const res = await handleCopyTrade({
      walletAddress: currentUserInfo?.address,
      copiedAddress: copiedInfo?.address,
      copyAmount,
      onceCopyAmount
    });
    if (res) {
      onClose();
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <div className={styles.main}>
        {/* copyied info */}
        <img
          className={styles.avatar}
          src={copiedInfo?.icon || defaultAvatar}
          alt=""
        />
        <div className={styles.userName}>
          Copy Trade
          <span style={{color: '#C9FF5D'}}>&nbsp;@{ formatLongText(copiedInfo?.name)  || formatAddress(copiedInfo?.address) || "FlipN"}</span>
        </div>

        {/* balance and advanced */}

        <div className={styles.balanceAndAdvanced}>
          <div className={styles.balance}>
            <BalanceIcon />
            <span>{solBalance} SOL</span>
          </div>
          <div className={styles.advancedAndSwitch}>
          <div className={styles.advanced}>
            <AdvancedIcon />
            <span>Advanced</span>
          </div>
          <Switch  
             style={{
              '--height': '24px',
              '--width': '44px',
            }}
            checked={isChecked}
            onChange={handleSwitchChange}
            className={isChecked ? styles.switchChecked : styles.switch}
          />
          </div>
        </div>
        
         {/* amount input */}
         <div className={styles.amountInput}>
          <div className={`${styles.textWhite} ${styles.amountInputBox}`}>
            <input
              type="text"
              placeholder="0"
              value={copyAmount}
              onChange={handleCopyAmountChange}
              style={{
               fontSize: '36px',
               border: 'none',
               textAlign: 'center',
               color:minCopyAmountTips ? '#FF2681' : '#fff',
              }}
            />
            
          </div>
          <span className={styles.amountIcon}>
              SOL
            </span>
          <p className={`${styles.amountDetail}  ${styles.textWhite07}`}>
            <span>${new Big(solPrice || 0).mul(copyAmount || 0).toString()}</span>
          </p>
        </div>


        {/* amount */}
        <div
          className={`${styles.amount} ${styles.public} ${styles.textWhite07}`}
        >
          <span>Amount</span>
          <div className={styles.amountLevel}>
            {AmountLevelList.map((item, index) => (
              <div
                key={"level" + item.key}
                onClick={() => {
                  setCopyAmount((item.key * +solBalance).toString());
                }}
              >
                {item.key * 100}%
                {index < AmountLevelList.length - 1 && (
                  <span className={styles.amountLevelSeparator}>|</span>
                )}
              </div>
            ))}
          </div>
        </div>

       

        {/* min */}
        <div className={`${styles.min} ${styles.textWhite07}`}>
          <span>Min:&nbsp;</span>
          <div>0.1 SOL / copy</div>
        </div>

        {/* your coppies */}
        <div
          className={`${styles.yourCoppies} ${styles.public} ${styles.textWhite07}`}
        >
          <div className={`${styles.public} ${styles.textWhite07}`}>
            <span>Your Copies</span>
            <div className={styles.setBtn} onClick={handleSetClick}>set</div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={copyTimes}
            onChange={handleCopyTimesChange}
            disabled={isInputDisabled}
            style={{
              color: isInputDisabled ? 'rgba(255,255,255,0.7)' : '#fff',
              fontSize: '16px',
              transform: 'scale(1)',
            }}
          />
        </div>

        {/* amount / copy */}

        <div className={`${styles.public} ${styles.textWhite07}`}>
          <span>Amount / copy</span>
          <div className={styles.textWhite}>
            {onceCopyAmountMap.integer + onceCopyAmountMap.decimal} SOL
          </div>
        </div>
        
        {minCopyAmountTips ? (
        <div className={styles.minCopyAmountTips}>
          Minimum amount is 0.1 SOL 
        </div>
      ) : <div className={styles.minCopyAmountTips}></div>}
        {/* copy button */}
        {
          window.sexAddress ? (
            <MainBtn
            isDisabled={!validateOnceCopyAmount}
            isLoading={isLoading}
            style={commonButtonStyle}
            onClick={handleCopyTradeClick}
          >
            Copy Trade
          </MainBtn>
          ) : 
          <MainBtn style={commonButtonStyle} onClick={() => window.connect()}>
            Connect Wallet
          </MainBtn>
        }
      </div>
    </Modal>
  );
}






















const BalanceIcon = ()=>{
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.9332 8.2551H12.7999C12.2341 8.2551 11.6915 8.48824 11.2914 8.90322C10.8913 9.31821 10.6666 9.88105 10.6666 10.4679C10.6666 11.0548 10.8913 11.6176 11.2914 12.0326C11.6915 12.4476 12.2341 12.6808 12.7999 12.6808H14.9332V14.8936C14.9332 15.187 14.8208 15.4684 14.6208 15.6759C14.4207 15.8834 14.1494 16 13.8665 16H1.06666C0.783761 16 0.512453 15.8834 0.312416 15.6759C0.11238 15.4684 0 15.187 0 14.8936V6.04227C0 5.89697 0.0275901 5.7531 0.0811946 5.61886C0.134799 5.48463 0.213368 5.36266 0.312416 5.25992C0.411464 5.15718 0.529052 5.07568 0.658465 5.02008C0.787877 4.96447 0.926581 4.93586 1.06666 4.93586H13.8665C14.0066 4.93586 14.1453 4.96447 14.2747 5.02008C14.4041 5.07568 14.5217 5.15718 14.6208 5.25992C14.7198 5.36266 14.7984 5.48463 14.852 5.61886C14.9056 5.7531 14.9332 5.89697 14.9332 6.04227V8.2551ZM11.1999 1.10656V3.82944H1.59998L9.70017 0.0952926C9.86258 0.0204512 10.0404 -0.0111135 10.2176 0.00346643C10.3948 0.0180464 10.5656 0.0783089 10.7146 0.178779C10.8636 0.279249 10.986 0.416742 11.0708 0.578768C11.1555 0.740794 11.1999 0.922217 11.1999 1.10656ZM12.7999 9.36151H14.9332C15.0733 9.36149 15.212 9.39009 15.3414 9.44568C15.4709 9.50128 15.5885 9.58277 15.6875 9.68551C15.7866 9.78826 15.8652 9.91023 15.9188 10.0445C15.9724 10.1787 16 10.3226 16 10.4679C16 10.6132 15.9724 10.7571 15.9188 10.8914C15.8652 11.0256 15.7866 11.1476 15.6875 11.2503C15.5885 11.3531 15.4709 11.4346 15.3414 11.4902C15.212 11.5458 15.0733 11.5744 14.9332 11.5743H12.7999C12.6598 11.5744 12.5211 11.5458 12.3916 11.4902C12.2622 11.4346 12.1446 11.3531 12.0455 11.2503C11.9465 11.1476 11.8679 11.0256 11.8143 10.8914C11.7606 10.7571 11.7331 10.6132 11.7331 10.4679C11.7331 10.3226 11.7606 10.1787 11.8143 10.0445C11.8679 9.91023 11.9465 9.78826 12.0455 9.68551C12.1446 9.58277 12.2622 9.50128 12.3916 9.44568C12.5211 9.39009 12.6598 9.36149 12.7999 9.36151Z" fill="#9290B1"/>
  </svg>  
}

const AdvancedIcon = ()=>{
  return <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 3.1543H8.53844" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M12.8462 3.1543H15" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="10.6924" cy="3.15384" r="2.15384" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M15 9.61621H7.46156" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M3.15381 9.61621H0.99997" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="2.15384" cy="2.15384" r="2.15384" transform="matrix(-1 0 0 1 7.46143 7.46191)" stroke="#9290B1" stroke-width="1.5" stroke-linecap="round"/>
  </svg>  
}