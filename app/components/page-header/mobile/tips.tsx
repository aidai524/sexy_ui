import styles from "./tips.module.css";
import SimpleAvatar from "../../avatar/simple";
import useTips from "./use-tips";
import { numberFormatter } from "@/app/utils/common";

const TYPES: Record<string, any> = {
  flip: {
    color: "#FBCA04",
    bg: "#FBCA0433",
    text: "Flipped"
  },
  buy: {
    color: "#C9FF5D",
    bg: "#C9FF5D33",
    text: "Bought"
  },
  sell: {
    color: "#FF2681",
    bg: "#FE05D933",
    text: "Sold"
  }
};
export default function Tips() {
  const { prevTip, tip, prevRef, currentRef } = useTips();

  return (
    <div className={styles.Container}>
      {[prevTip, tip].map((item: any, i: number) => (
        <div
          className={styles.Tip}
          style={{
            backgroundColor:
              item && TYPES[item.trade_type]
                ? TYPES[item.trade_type].bg
                : "transparent",
            width: 200
          }}
          key={i}
          ref={i === 0 ? prevRef : currentRef}
        >
          {item && (
            <>
              <div
                className={styles.Type}
                style={{ backgroundColor: TYPES[item.trade_type].color }}
              >
                <SimpleAvatar icon={item.account_icon} size={16} />
                <div>{TYPES[item.trade_type].text}</div>
              </div>
              <div className={styles.Token}>
                <div style={{ flexShrink: 0 }}>
                  {numberFormatter(item.sol_amount / 1e9, 2, true)} SOL{" "}
                </div>
                <img src={item.token_icon} className={styles.TokenIcon} />
                <div className={styles.TokenName}>{item.token_symbol} </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
