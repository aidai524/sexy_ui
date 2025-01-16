import { useEffect, useMemo, useState } from "react";
import styles from "./token.module.css";
import type { Project } from "@/app/type";
import { simplifyNum, timeAgo } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import TokenAction from "../tokenAction";
import useMc from "@/app/hooks/useMc";
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';
import { SOL } from '@/app/components/trade/buySellPump';
import { useUser } from '@/app/store/useUser';

interface Props {
  data: Project;
  update: () => void;
  prepaidWithdrawDelayTime: number;
  hideHot?: boolean;
  from?: string;
  isOther: boolean;
  onWithdrawSuccess?(): void;
}

export default function Token({
  data,
  update,
  prepaidWithdrawDelayTime,
  hideHot,
  from,
  isOther,
  onWithdrawSuccess
}: Props) {
  const router = useRouter();
  const { userInfo }: any = useUser();

  const [mc, setMC] = useState<string | number>(0);
  const [isPrepaid, setIsPrepaid] = useState(false);

  const { mc: pumpMc } = useMc({
    tokenAddress: data?.address,
    disable: data?.status! < 1
  });

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

  const smookeable = useMemo(() => {
    if (data.account === userInfo?.address) return false;
    if (data.isSuperLike) {
      return 1;
    }
    return 2;
  }, [data, userInfo]);

  const showWithdraw = useMemo(
    () => isDelay && !isOther && isPrepaid,
    [isDelay, isOther, isPrepaid]
  );

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

  useEffect(() => {
    if (isOther) {
      setIsPrepaid(false);
      return;
    }
    checkPrePayed().then((res) => {
      if (Number(res) > 0) {
        setIsPrepaid(true);
      }
    });
  }, [isOther, data]);

  return (
    <div className={`${styles.main} ${from === "page" && styles.PageToken}`}>
      <div className={styles.tokenMag}>
        <div
          className={`${styles.tokenImgContent} button`}
          onClick={() => {
            router.push("/detail?address=" + data.address);
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
            <div className={styles.tickerName}>
              <div>Ticker: {data.ticker}</div>
              <div
                className={styles.tickerNameAvatar}
                style={{
                  backgroundImage: `url("${data.tokenIcon || data.tokenImg || '/img/token-placeholder.png'}")`,
                  border: (data.status === 0 && !!smookeable && !showWithdraw) ? `${smookeable === 1 ? '1px dashed #FFF' : '1px dashed #9290B1'}` : '',
                }}
              />
            </div>
          </div>
          {
            data?.status === 0 ? (
              <>
                <div className={styles.trikerContent}>
                  <div className={styles.Likes}>
                    <div>Likes: <span style={{ color: 'white' }}>{data?.like}</span>/100</div>
                    <img src="/img/profile/icon-like.svg" alt="" width={13} height={11} />
                  </div>
                </div>
                <div className={styles.trikerContent}>
                  <div className={styles.tickerName}>
                    Flipped: {numberFormatter(Big(data?.prePaidAmount || 0).div(10 ** SOL.tokenDecimals), 2, true)} SOL
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.MarketCap}>
              MarketCap:{' '}
                {pumpMc || mc ? `$${simplifyNum(Number(pumpMc || mc), 2)}` : '-'}
              </div>
            )
          }
        </div>
      </div>

      <TokenAction
        isOther={isOther}
        isDelay={isDelay}
        token={data}
        prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
        onWithdrawSuccess={onWithdrawSuccess}
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

  if (type === 3) {
    return (
      <div className={styles.launchTag + " " + styles.launch3}>Launched</div>
    );
  }
}
