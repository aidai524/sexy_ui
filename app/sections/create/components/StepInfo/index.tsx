import React from 'react';
import styles from './style.module.css';

interface StepInfoProps {
  number: number;
  title: string;
  optional?: boolean;
}

const StepInfo: React.FC<StepInfoProps> = ({ number, title, optional = false }) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.numberBadge}>
        {number}
      </div>
      <div className={styles.titleContainer}>
        <span className={styles.title}>{title}</span>
        {optional && <span className={styles.optional}>Optional</span>}
      </div>
    </div>
  );
};

export default StepInfo; 