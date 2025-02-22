import styles from "./index.module.css";
import { simplifyNum } from "@/app/utils";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import TradeButton from "./button";

export default function Trade({ token, isCurrent, onClick }: any) {
  const mc = useMcWithPump(token);
  return (
    <div className={`${styles.Container}`} onClick={onClick}>
      {token.bondingProgress !== 100 ? (
        <div>
          <div className={styles.McWrapper}>
            <div className={styles.McBox}>
              <div
                className={styles.Mc}
                style={{
                  color: token.market_cap_change < 0 ? "#FF2681" : "#C9FF5D"
                }}
              >
                ${Number(mc) > 0 ? simplifyNum(Number(mc), 2) : "-"}
              </div>
              <div>MC</div>
            </div>
            <div>{token.bondingProgress}%</div>
          </div>
          <div className={styles.Progress}>
            <div
              className={styles.ProgressInner}
              style={{
                width: `${token.bondingProgress}%`
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <div>Market Cap</div>
          <div
            className={styles.Mc}
            style={{
              color: token.market_cap_change < 0 ? "#FF2681" : "#C9FF5D"
            }}
          >
            ${Number(mc) > 0 ? simplifyNum(Number(mc), 2) : "-"}
          </div>
        </div>
      )}
      {isCurrent && <TradeButton token={token} onClick={onClick} />}
    </div>
  );
}
