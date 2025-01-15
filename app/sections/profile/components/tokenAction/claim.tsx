import { useState } from "react";
import styles from "./index.module.css";
import { fail, success } from "@/app/utils/toast";
import { DotLoading } from "antd-mobile";
import { motion } from "framer-motion";

export default function Claim({
  isPrepaid,
  isOther,
  isClaimed,
  setIsClaimed,
  prepaidTokenWithdraw
}: any) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
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
  };

  return (
    !!(isPrepaid && !isOther) &&
    (isClaimed ? (
      <button
        type="button"
        className={`${styles.ActionBtn} ${styles.ClaimDisabled}`}
      >
        Claimed
      </button>
    ) : (
      <div className={styles.ClaimContainer}>
        <motion.div
          className={styles.ClaimBg1}
          initial={{ opacity: 0, scaleX: 0.8, scaleY: 0.8 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.8, 1, 1.42], scaleY: [0.8, 1.1, 1.52] }}
          transition={{ times: [0, 0.1, 1], repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <motion.div
          className={styles.ClaimBg1}
          initial={{ opacity: 0, scaleX: 0.8, scaleY: 0.8 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.8, 1, 1.42], scaleY: [0.8, 1.1, 1.52] }}
          transition={{ delay: 1, times: [0, 0.1, 1], repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <button
          type="button"
          className={`${styles.ActionBtn} ${styles.Claim} button`}
          onClick={handleClaim}
        >
          {isLoading ? <DotLoading /> : "Claim"}
        </button>
      </div>
    ))
  );
}
