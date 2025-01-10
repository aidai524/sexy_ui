import styles from "./desc.module.css";
import StatusTag from "@/app/components/tag/status";
import ImportTag from "@/app/components/tag/import";
import { formatAddress, timeAgo, simplifyNum } from "@/app/utils";
import { useMemo, useState, useEffect } from "react";
import useMc from "@/app/hooks/useMc";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useRouter } from "next/navigation";

export default function Desc({ token }: any) {
  const [mc, setMc] = useState(0);
  const router = useRouter();
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
      className={`button ${styles.Container}`}
      onClick={() => {
        router.push(`/detail?address=${token.address}`);
      }}
    >
      <div className={styles.Title}>{token.tokenName}</div>
      <div className={styles.Header}>
        <img
          style={{ borderColor: token.status === 0 ? "#fff" : "transparent" }}
          className={styles.Avatar}
          src={token.tokenImg || "/img/token-icon-placeholder.svg"}
        />
        <div className={styles.TickerWrapper}>
          <span className={styles.TickerLabel}>Ticker: </span>
          <span className={styles.Ticker}>{token.ticker}</span>
        </div>
        <StatusTag type={token.status} />
        {true && <ImportTag />}
      </div>
      {token.DApp === "sexy" && mc > 0 && (
        <div className={styles.MC}>Market Cap: ${simplifyNum(mc, 2)}</div>
      )}
      {token.DApp === "pump" && pumpMc > 0 && (
        <div className={styles.MC}>Market Cap: ${simplifyNum(pumpMc, 2)}</div>
      )}
      <div className={styles.Create}>
        <span>Created by</span>
        <span className={styles.Creator}> {creator}</span>
        <span> in {timeAgo(token.time)}</span>
      </div>
      {token.status === 0 && <div className={styles.About}>{token.about}</div>}
    </div>
  );
}
