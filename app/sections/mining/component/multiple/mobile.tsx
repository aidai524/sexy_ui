import styles from "./mobile.module.css";
import Bg from "./bg";
import RewardIcon from "@/app/components/icons/reward";
import { numberFormatter } from "@/app/utils/common";

export default function Multiple({ num, rewards }: any) {
  return (
    <div className={styles.Container}>
      <Bg />

      <div className={styles.Wrapper}>
        <div>
          <div className={styles.Num}>{num}</div>
          <div className={styles.Desc}>Fun / Like</div>
        </div>
        <div>
          <div className={styles.Reward}>
            {rewards
              ? numberFormatter(rewards, 3, true, {
                  isShort: true,
                  round: 0
                })
              : "0"}
          </div>
          <div className={styles.Desc}>My rewards</div>
        </div>
      </div>

      <RewardIcon
        className={styles.RewardIcon}
        style={{
          left: 14,
          top: 13
        }}
      />
      <RewardIcon
        className={styles.RewardIcon}
        size={15}
        style={{
          opacity: 0.1,
          left: 13,
          top: 45,
          transform: "rotate(75deg)"
        }}
      />
      <RewardIcon
        className={styles.RewardIcon}
        size={16}
        style={{
          opacity: 0.3,
          left: 34,
          top: 9,
          transform: "rotate(90deg)"
        }}
      />
      <RewardIcon
        className={styles.RewardIcon}
        size={21}
        style={{
          right: 10,
          top: 43,
          transform: "rotate(75deg)"
        }}
      />
      <RewardIcon
        className={styles.RewardIcon}
        size={12}
        style={{
          opacity: 0.1,
          left: 107,
          top: 5,
          transform: "rotate(45deg)"
        }}
      />
      <RewardIcon
        className={styles.RewardIcon}
        size={15}
        style={{
          opacity: 0.3,
          right: 76,
          bottom: 12,
          transform: "rotate(-90deg)"
        }}
      />
    </div>
  );
}
