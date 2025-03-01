import WalletIcon from "./wallet-icon";
import styles from "./index.module.css";
import Big from "big.js";
import useBalance from "@/app/hooks/useBalance";
import { useSetting } from "@/app/store/use-setting";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useConfig } from "@/app/store/useConfig";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useAccount } from "@/app/hooks/useAccount";
import { numberFormatter } from "@/app/utils/common";
import { fail, success } from "@/app/utils/toast";
import CircleLoading from "@/app/components/icons/loading";

export default function FlipPanel({ from, token, onClose, onSuccess }: any) {
  const { flipMax, set }: any = useSetting();
  const [inputVal, setInputVal] = useState(flipMax.toString() || "1");
  const { solBalance } = useBalance({
    mint: token.address as string,
    tokenDecimals: token.tokenDecimals as number,
    reFreshBalnace: 1000
  });
  const { config }: any = useConfig();
  const [loading, setLoading] = useState(false);
  const [isPrePaid, setIsPrePaid] = useState(false);
  const { address } = useAccount();
  const { prePaid, checkPrePayed } = useTokenTrade({
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol as string,
    tokenDecimals: token.tokenDecimals as number,
    loadData: false
  });

  const onFlip = useCallback(async () => {
    if (!inputVal) return;
    try {
      setLoading(true);
      const inputNum = new Big(inputVal).mul(10 ** 9).toFixed(0);
      const res = await prePaid(inputNum, false);
      setLoading(false);
      if (res) {
        success("Flip success");
        onSuccess?.(inputVal);
      }
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        fail(e.message);
      } else {
        fail("Transtion fail");
      }
    } finally {
      setLoading(false);
    }
  }, [inputVal]);

  useEffect(() => {
    if (!address || address === token.account) {
      setIsPrePaid(true);
      return;
    }
    checkPrePayed().then((prdPaydval) => {
      setIsPrePaid(prdPaydval > 0);
    });
  }, [checkPrePayed, address, token]);

  const errorTips = useMemo(() => {
    if (isPrePaid) return `You've fliped ${token.total_amount} SOL!`;
    if (Big(inputVal || 0).eq(0)) return "Enter an amount";
    return Big(inputVal || 0).gt(solBalance || 0) ? "Insufficient Balance" : "";
  }, [solBalance, inputVal, isPrePaid]);

  return (
    <div className={styles.Container}>
      <div className={styles.InputWrapper}>
        <div className={styles.BalanceWrapper}>
          <WalletIcon />
          <div>{numberFormatter(solBalance, 2, true)} SOL</div>
        </div>
        <div className={styles.InputBox}>
          <input
            className={styles.Input}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setInputVal(e.target.value);
                set({ flipMax: val });
              }
            }}
          />
          <div>SOL</div>
        </div>
      </div>
      <div className={styles.DescWrapper}>
        <div className={styles.Tags}>
          {[0.1, 0.5, 1].map((item) => (
            <div
              key={item}
              className={`${styles.Tag} ${
                item === Number(inputVal) && styles.Active
              }`}
              onClick={() => {
                setInputVal(item);
              }}
            >
              {item}
            </div>
          ))}
          <div
            className={`${styles.Tag} ${
              solBalance === inputVal && styles.Active
            }`}
            onClick={() => {
              if (!isNaN(Number(solBalance))) {
                setInputVal(solBalance);
              }
            }}
          >
            Max
          </div>
        </div>
        <div className={styles.Value}>
          {" "}
          $
          {numberFormatter(Number(config.SolPrice) * Number(inputVal), 2, true)}
        </div>
      </div>
      {address ? (
        <button
          className={`${styles.Button} button`}
          disabled={loading || !!errorTips}
          onClick={onFlip}
        >
          {loading ? <CircleLoading size={16} /> : errorTips || "Flip it!"}
        </button>
      ) : (
        <button
          className={`${styles.Button} button`}
          onClick={() => {
            window?.connect();
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
