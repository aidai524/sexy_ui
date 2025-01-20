import styles from './index.module.css';
import { useCountdown } from '@/app/components/airdrop/hooks/use-countdown';

const Countdown = (props: any) => {
  const { style } = props;

  const [countdown] = useCountdown();

  return (
    <div
      className={(countdown && countdown.end <= 0) ? styles.AirdropCountdownContainerEnded : styles.AirdropCountdownContainer}
      style={style}
    >
      {
        (countdown && countdown.end <= 0) ? (
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
                  {countdown?.endSplit?.[0]}
                </div>
                <div className={styles.AirdropCountdownLabel}>
                  days
                </div>
              </div>
              <div className={styles.AirdropCountdownItem}>
                <div className={styles.AirdropCountdownValue}>
                  {countdown?.endSplit?.[1]}
                </div>
                <div className={styles.AirdropCountdownLabel}>
                  hours
                </div>
              </div>
              <div className={styles.AirdropCountdownItem}>
                <div className={styles.AirdropCountdownValue}>
                  {countdown?.endSplit?.[2]}
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
