import styles from "./index.module.css";
import { simplifyNum } from "@/app/utils";
import TradeButton from "./button";

export default function Trade({ token, isCurrent, onClick }: any) {
  return (
    <div className={`${styles.Container}`} onClick={onClick}>
      {token.bondingProgress !== 100 && token.status !== 3 ? (
        <div>
          <div className={styles.McWrapper}>
            <div className={styles.McBox}>
              <div
                className={styles.Mc}
                style={{
                  color:
                    Number(token.market_cap_24h_usd) < 0 ? "#FF2681" : "#C9FF5D"
                }}
              >
                ${Number(token.mc) > 0 ? simplifyNum(Number(token.mc), 2) : "-"}
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
            ${Number(token.mc) > 0 ? simplifyNum(Number(token.mc), 2) : "-"}
          </div>
        </div>
      )}
      {isCurrent && <TradeButton token={token} onClick={onClick} />}
    </div>
  );
}
