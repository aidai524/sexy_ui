import styles from './index.module.css';
import { useConfig } from '@/app/store/useConfig';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

const Countdown = (props: any) => {
  const { style } = props;

  const { config }: any = useConfig();
  const { AirdropEndTime, AirdropStartTime } = config || {};

  const timer = useRef<any>(0);

  const [result, setResult] = useState<{ value: number; split: number[] }>();

  useEffect(() => {
    const calc = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(calc, 60000);
      const _result = {
        split: [0, 0, 0],
        value: 0,
      };
      const curr = dayjs();
      const end = dayjs(AirdropEndTime);
      if (curr.isSameOrAfter(end)) {
        setResult(_result)
        return _result;
      }
      const diff = end.diff(curr);
      const diffDuration = dayjs.duration(diff);
      const days = diffDuration.days();
      const hours = diffDuration.hours();
      const minutes = diffDuration.minutes();

      _result.value = diff;
      _result.split = [days, hours, minutes];
      setResult(_result)
      return _result;
    };

    calc();
    return () => {
      clearTimeout(timer.current);
    };
  }, [AirdropEndTime]);

  return (
    <div
      className={(result && result.value <= 0) ? styles.AirdropCountdownContainerEnded : styles.AirdropCountdownContainer}
      style={style}
    >
      {
        (result && result.value <= 0) ? (
          <div>
            The airdrop event has ended.
          </div>
        ) : (
          <>
            <div className={styles.AirdropCountdownTitle}>
              Ends in
            </div>
            <div className={styles.AirdropCountdownItems}>
              <div className={styles.AirdropCountdownItem}>
                <div className={styles.AirdropCountdownValue}>
                  {result?.split?.[0]}
                </div>
                <div className={styles.AirdropCountdownLabel}>
                  days
                </div>
              </div>
              <div className={styles.AirdropCountdownItem}>
                <div className={styles.AirdropCountdownValue}>
                  {result?.split?.[1]}
                </div>
                <div className={styles.AirdropCountdownLabel}>
                  hours
                </div>
              </div>
              <div className={styles.AirdropCountdownItem}>
                <div className={styles.AirdropCountdownValue}>
                  {result?.split?.[2]}
                </div>
                <div className={styles.AirdropCountdownLabel}>
                  mins
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default Countdown;
