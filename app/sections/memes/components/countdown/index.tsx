import styles from './index.module.css';
import clsx from 'clsx';
import { IconStopwatch } from '@/app/sections/memes/components/summary-item/icons';
import { useEffect, useState } from 'react';

interface CountdownProps {
  className?: string;
  token: {
    countdown: number; // countdown value in milliseconds
  };
  onFinish?: () => void; // callback function when countdown ends
}

const Countdown = (props: CountdownProps) => {
  const { className, token, onFinish } = props;
  const [remainingTime, setRemainingTime] = useState(token.countdown);

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // Trigger callback when countdown reaches zero
          onFinish?.();
          return 0;
        }
        return prev - 1000; // Decrease 1000ms (1 second) each time
      });
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, [onFinish]);

  // Convert milliseconds to hours, minutes and seconds
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  // Format number to ensure two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={clsx(styles.CountdownContainer, className)}>
      <IconStopwatch />
      <div className={styles.CountdownNumber}>
        {formatNumber(hours)} : {formatNumber(minutes)} : {formatNumber(seconds)}
      </div>
    </div>
  );
};

export default Countdown;
