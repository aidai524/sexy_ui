import { useState } from "react";
import styles from "../index.module.css";
import { motion } from "framer-motion";
import ClaimModal from '@/app/sections/profile/components/tokenAction/claim/modal';

export default function Claim(props: any) {
  const {
    isPrepaid,
    isOther,
    isClaimed,
  } = props;

  const [visible, setVisible] = useState(false);

  const handleClaim = () => {
    setVisible(true);
  };

  return (
    <>
      {
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
              initial={{ opacity: 0, scaleX: 0.9, scaleY: 0.9 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0.9, 1, 1.3], scaleY: [0.9, 1.05, 1.6] }}
              transition={{ times: [0, 0.1, 1], repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <motion.div
              className={styles.ClaimBg1}
              initial={{ opacity: 0, scaleX: 0.9, scaleY: 0.9 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0.9, 1, 1.3], scaleY: [0.9, 1.05, 1.6] }}
              transition={{ delay: 1, times: [0, 0.1, 1], repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <button
              type="button"
              className={`${styles.ActionBtn} ${styles.Claim} button`}
              onClick={handleClaim}
            >
              Claim
            </button>
          </div>
        ))
      }
      <ClaimModal
        {...props}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
