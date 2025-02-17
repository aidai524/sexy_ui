import styles from "./desc.module.css";
import { formatAddress, timeAgo } from "@/app/utils";
import { useMemo } from "react";
import { useHome } from "../context";
import { useUserAgent } from "@/app/context/user-agent";
import TokenTags from "@/app/components/tokenTags";

export default function Desc({ token }: any) {
  const { goDetail } = useHome();
  const { isMobile } = useUserAgent();

  const creator = useMemo(() => {
    if (token.creater) {
      if (token.creater.name) {
        return token.creater.name;
      }

      if (token.creater.address) {
        return formatAddress(token.creater.address);
      }
    }

    if (token.account) {
      return formatAddress(token.account);
    }
    return "-";
  }, [token]);

  return (
    <div
      className={styles.Container}
      onClick={() => {
        if (isMobile) goDetail(token);
      }}
    >
      <div className={styles.Title}>{token.tokenName}</div>
      <div className={styles.Header}>
        <img
          style={{ borderColor: token.status === 0 ? "#fff" : "transparent" }}
          className={styles.Avatar}
          src={token.icon || "/img/token-icon-placeholder.svg"}
        />
        <div className={styles.TickerWrapper}>
          <span className={styles.TickerLabel}>Ticker: </span>
          <span className={styles.Ticker}>{token.ticker}</span>
        </div>
        <div className={styles.StatusWrapper}>
          <TokenTags token={token} />
        </div>
      </div>

      <div className={styles.Create}>
        <span>Created by</span>
        <span
          className={`${styles.Creator} text-overflow`}
          style={{ maxWidth: 160 }}
        >
          {" "}
          {creator}
        </span>
        <span> {timeAgo(token.time)}</span>
      </div>
      {token.status === 0 && (
        <div
          className={styles.About}
          style={{
            width: isMobile ? "calc(100% - 60px)" : "100%"
          }}
        >
          {token.about}
        </div>
      )}
    </div>
  );
}
