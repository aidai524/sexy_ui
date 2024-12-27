import styles from "./boost.module.css";
import { BoostIcon } from "./boostIocn";

interface Props {
  onJoinVip: () => void;
  onCanceVip: () => void;
}

export default function BoostInit({ onJoinVip, onCanceVip }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.boostInit}>
        <div className={styles.initTipContent}>
          <BoostIcon />
          <div className={styles.initTitle}>Boost</div>
          <div className={styles.initAmount}>0/0</div>
          <div className={styles.initTip}>
            Boost allows the MEME exposure up to 8.5x in FlipN for 30 minutes.
            VIP users will have 2 chances per day to boost MEMEs.
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          onJoinVip();
        }}
        className={styles.sureBtn}
      >
        Join VIP
      </div>
      <div
        onClick={() => {
          onCanceVip();
        }}
        className={styles.cancelBtn}
      >
        No, Thanks
      </div>
    </div>
  );
}
