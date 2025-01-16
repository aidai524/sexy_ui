import styles from "./index.module.css";
import { useState } from "react";
import { DotLoading } from "antd-mobile";
import { fail, success } from "@/app/utils/toast";

export default function Withdraw({
  prepaidSolWithdraw,
  onSuccess,
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawed, setIsWithdrawed] = useState(false);

  return (
    isWithdrawed ? (
      <button className={`${styles.ActionBtn} ${styles.DisabledBtn}`}>
        Refunded
      </button>
    ) : (
      <button
        className={`${styles.ActionBtn} ${styles.Withdraw} button`}
        onClick={async () => {
          setIsLoading(true);
          try {
            const res = await prepaidSolWithdraw();

            if (!res) {
              fail("Refund fail");
            } else {
              success("Refund success");
              setIsWithdrawed(true);
              // fix#REF-9368
              onSuccess?.();
            }
          } catch (e) {
            console.log(e);
            fail("Refund fail");
          }

          setIsLoading(false);
        }}
      >
        {isLoading ? <DotLoading /> : "Refund"}
      </button>
    )
  );
}
