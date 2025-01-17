import styles from "../index.module.css";
import { useState } from "react";
import WithdrawModal from '@/app/sections/profile/components/tokenAction/withdraw/modal';

export default function Withdraw(props: any) {
  const [visible, setVisible] = useState(false);
  const [isWithdrawed, setIsWithdrawed] = useState(false);

  const handleWithdraw = () => {
    setVisible(true);
  };

  return (
    <>
      {
        isWithdrawed ? (
          <button className={`${styles.ActionBtn} ${styles.DisabledBtn}`}>
            Refunded
          </button>
        ) : (
          <button
            className={`${styles.ActionBtn} ${styles.Withdraw} button`}
            onClick={handleWithdraw}
          >
            Refund
          </button>
        )
      }
      <WithdrawModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        isWithdrawed={isWithdrawed}
        setIsWithdrawed={setIsWithdrawed}
        {...props}
      />
    </>
  );
}
