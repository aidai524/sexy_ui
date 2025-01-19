import styles from "./desc.module.css";
import StatusTag from "@/app/components/tag/status";
import ImportTag from "@/app/components/tag/import";
import { formatAddress, timeAgo, simplifyNum } from "@/app/utils";
import { useMemo, useState, useEffect } from "react";
import useMc from "@/app/hooks/useMc";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useHome } from "../context";
import { useUserAgent } from "@/app/context/user-agent";
import TokenTags from "@/app/components/tokenTags";

export default function Desc({ token }: any) {
  const [mc, setMc] = useState(0);
  const { goDetail } = useHome();
  const { isMobile } = useUserAgent();
  const { mc: pumpMc } = useMc({
    tokenAddress: token.address,
    disable: token.status! < 1
  });
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

  const { getMC } = useTokenTrade({
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol as string,
    tokenDecimals: token.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    if (token && token.DApp === "sexy" && token.status === 1) {
      getMC().then((res) => {
        if (!isNaN(Number(res))) {
          setMc(Number(res));
        }
      });
    }
  }, [token]);

  return (
    <div
      className={styles.Container}
      onClick={() => {
        // router.push(`/detail?address=${token.address}`);
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
      {token.DApp === "sexy" && (
        <div className={styles.MC}>
          Market Cap: ${mc > 0 ? simplifyNum(mc, 2) : "-"}
        </div>
      )}
      {token.DApp === "pump" && (
        <div className={styles.MC}>
          Market Cap: ${pumpMc > 0 ? simplifyNum(pumpMc, 2) : "-"}
        </div>
      )}
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
      {token.status === 0 && <div className={styles.About}>{token.about}</div>}
    </div>
  );
}
