import { useState } from "react";
import styles from "./index.module.css";
import { fail, success } from "@/app/utils/toast";
import { DotLoading } from "antd-mobile";

export default function Claim({
  isPrepaid,
  isOther,
  prepaidTokenWithdraw
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  return (
    isPrepaid &&
    !isOther &&
    (isClaimed ? (
      <button className={`${styles.ActionBtn} ${styles.DisabledBtn}`}>
        Claimed
      </button>
    ) : (
      <button
        className={`${styles.ActionBtn} ${styles.Withdraw} button`}
        onClick={async () => {
          setIsLoading(true);
          try {
            const res = await prepaidTokenWithdraw();
            if (!res) {
              fail("Claim fail");
            } else {
              success("Claim success");
              setIsClaimed(true);
            }
          } catch (e) {
            console.log(e);
            fail("Claim fail");
          }

          setIsLoading(false);
        }}
      >
        {isLoading ? <DotLoading /> : "Claim"}
      </button>
    ))
  );
}
