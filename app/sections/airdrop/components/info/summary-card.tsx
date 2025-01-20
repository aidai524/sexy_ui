import styles from "./index.module.css";
import React from 'react';

const SummaryCard = (props: any) => {
  const { label, value } = props;

  return (
    <div className={styles.AirdropInfoSummaryCard}>
      <div className={styles.AirdropInfoSummaryCardLabel}>
        {label}
      </div>
      <div className={styles.AirdropInfoSummaryCardValue}>
        {value}
      </div>
    </div>
  );
};

export default SummaryCard;
