import React, { useState, useEffect, useMemo,useRef } from "react";
import styles from "./index.module.css";
import Modal from "@/app/components/modal";
import { defaultAvatar } from "@/app/utils/config";
import { formatAddress } from "@/app/utils";
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
      walletAddress: currentUserInfo.address,
      copiedAddress: copiedInfo.address,
      copyAmount,
      onceCopyAmount
    });
    if (res) {
      onClose();
    }
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
          Copy @
          {formatAddress(copiedInfo?.name || copiedInfo?.address || "FlipN")}
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

        {/* amount input */}
        <div className={styles.amountInput}>
          <div className={`${styles.textWhite} ${styles.amountInputBox}`}>
            <input
              type="text"
              placeholder="Enter the amount"
              value={copyAmount}
              onChange={handleCopyAmountChange}
              style={{
               fontSize: '16px',
               transform: 'scale(1)',
              }}
            />
            <span className={styles.amountIcon}>
              <span>SOL</span>{" "}
              <img src="/img/home/solana.png" className={styles.SolnaIcon} />
            </span>
          </div>
          <p className={`${styles.amountDetail}  ${styles.textWhite07}`}>
            <span>~${new Big(solPrice || 0).mul(copyAmount || 0).toString()}</span>
            <span>Bal: {solBalance} SOL</span>
          </p>
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
      {minCopyAmountTips && (
        <Warning warning="Min copy amount must greater or equal to 0.1 Sol" />
      )}
    </Modal>
  );
}
