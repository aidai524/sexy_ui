import styles from "./index.module.css";
import { useState, useMemo } from "react";
import { DotLoading } from "antd-mobile";
import { fail, success } from "@/app/utils/toast";
export default function Withdraw({
  prepaidSolWithdraw,
  prepaidWithdrawDelayTime,
  token,
  isPrepaid,
  isOther
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawed, setIsWithdrawed] = useState(false);

  const isDelay = useMemo(() => {
    return (
      prepaidWithdrawDelayTime &&
      token.createdAt &&
      Date.now() - token.createdAt > prepaidWithdrawDelayTime
    );
  }, [prepaidWithdrawDelayTime, token]);

  const showWithdraw = useMemo(
    () => isDelay && !isOther && isPrepaid,
    [isDelay, isOther, isPrepaid]
  );

  return (
    showWithdraw &&
    //
    (isWithdrawed ? (
      <button className={`${styles.ActionBtn} ${styles.DisabledBtn}`}>
        Withdrew
      </button>
    ) : (
      <button
        className={`${styles.ActionBtn} ${styles.Withdraw} button`}
        onClick={async () => {
          setIsLoading(true);
          try {
            const res = await prepaidSolWithdraw();

            if (!res) {
              fail("Withdraw fail");
            } else {
              success("Withdraw success");
              setIsWithdrawed(true);
            }
          } catch (e) {
            console.log(e);
            fail("Withdraw fail");
          }

          setIsLoading(false);
        }}
      >
        {isLoading ? <DotLoading /> : "Withdraw"}
      </button>
    ))
  );
}
