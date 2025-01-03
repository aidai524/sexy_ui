import { useEffect, useMemo, useState } from "react";
import styles from "./token.module.css";
import type { Project } from "@/app/type";
import { simplifyNum, timeAgo } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import TokenAction from "../tokenAction";

interface Props {
  data: Project;
  update: () => void;
  prepaidWithdrawDelayTime: number;
  hideHot?: boolean;
  from?: string;
  isOther: boolean;
}

export default function Token({
  data,
  update,
  prepaidWithdrawDelayTime,
  hideHot,
  from,
  isOther
}: Props) {
  const router = useRouter();
  const [mc, setMC] = useState<string | number>("-");

  const { getMC, pool, checkPrePayed } = useTokenTrade({
    tokenName: data?.tokenName as string,
    tokenSymbol: data?.tokenSymbol as string,
    tokenDecimals: data?.tokenDecimals as number,
    loadData: false
  });

  const isDelay = useMemo(() => {
    if (
      prepaidWithdrawDelayTime &&
      data.createdAt &&
      Date.now() - data.createdAt > prepaidWithdrawDelayTime
    ) {
      return true;
    }
    return false;
  }, [prepaidWithdrawDelayTime, data]);

  useEffect(() => {
    if (
      pool &&
      pool.length > 0 &&
      data?.DApp === "sexy" &&
      data?.status === 1
    ) {
      getMC().then((res) => {
        setMC(res as number);
      });
    }
  }, [pool, data]);

  return (
    <div className={`${styles.main} ${from === "page" && styles.PageToken}`}>
      <div className={styles.tokenMag}>
        <div
          className={`${styles.tokenImgContent} button`}
          onClick={() => {
            router.push("/detail?id=" + data.id);
          }}
        >
          <img
            className={styles.tokenImg}
            src={
              data.tokenIcon || data.tokenImg || "/img/token-placeholder.png"
            }
          />
          <LaunchTag type={data.status as number} />
        </div>

        <div className={styles.nameContent}>
          <div className={styles.name}>{data.tokenName}</div>
          <div className={styles.trikerContent}>
            <div className={styles.tickerName}>Ticker: {data.ticker}</div>
          </div>
          <div className={styles.MarketCap}>
            Mc: {mc && mc !== "-" ? `$${simplifyNum(Number(mc), 2)}` : "-"}
          </div>
          <div className={styles.createTime}>{timeAgo(data.time)}</div>
        </div>
      </div>

      <TokenAction
        isOther={isOther}
        isDelay={isDelay}
        token={data}
        prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
      />
    </div>
  );
}

function LaunchTag({ type }: { type: number }) {
  if (type === 0) {
    return (
      <div className={styles.launchTag + " " + styles.launch1}>Pre-Launch</div>
    );
  }

  if (type === 1) {
    return (
      <div className={styles.launchTag + " " + styles.launch2}>Launching</div>
    );
  }
}
