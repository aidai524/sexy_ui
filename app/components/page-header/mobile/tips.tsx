import styles from "./tips.module.css";
import SimpleAvatar from "../../avatar/simple";
import useTips from "./use-tips";
import { numberFormatter } from "@/app/utils/common";

const TYPES: Record<string, any> = {
  Flipped: {
    color: "#FBCA04",
    bg: "#FBCA0433"
  },
  Bought: {
    color: "#C9FF5D",
    bg: "#C9FF5D33"
  },
  Sold: {
    color: "#FF2681",
    bg: "#FE05D933"
  }
};
export default function Tips({ type = "Flipped" }: any) {
  const { prevTip, tip, prevRef, currentRef } = useTips();

  return (
    <div className={styles.Container}>
      {[prevTip, tip].map((item: any, i: number) => (
        <div
          className={styles.Tip}
          style={{
            backgroundColor: item ? TYPES[type].bg : "transparent",
            width: 200
          }}
          key={i}
          ref={i === 0 ? prevRef : currentRef}
        >
          {item && (
            <>
              <div
                className={styles.Type}
                style={{ backgroundColor: TYPES[type].color }}
              >
                <SimpleAvatar icon={""} size={16} />
                <div>{type}</div>
              </div>
              <div className={styles.Token}>
                <div>
                  {numberFormatter(item.sol_amount / 1e9, 4, true)} SOL{" "}
                </div>
                <img src={item.icon} className={styles.TokenIcon} />
                <div className={styles.TokenName}>{item.token_symbol} </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
