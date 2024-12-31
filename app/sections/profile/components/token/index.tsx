import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./token.module.css";
import { DotLoading, Modal } from "antd-mobile";
import BoostJust from "@/app/components/boost/boostJust";
import type { Project } from "@/app/type";
import { simplifyNum, timeAgo } from "@/app/utils";
import SmokeBtn from "@/app/components/smokHot";
import { useRouter } from "next/navigation";
import Boost from "@/app/components/boost";
import useTimeLeft from "@/app/hooks/useTimeLeft";
import LauncdedAction from "@/app/components/action/launched";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { fail, success } from "@/app/utils/toast";
import TokenAction from "../tokenAction";
import { useUser } from "@/app/store/useUser";

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
            {/* <img onClick={() => {
                        router.push('/profile/user?account=' + data.account)
                    }} className={styles.createrImg} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" /> */}
          </div>
          <div className={styles.MarketCap}>
            Market cap: {mc && mc !== "-" ? simplifyNum(Number(mc)) : "-"}
          </div>
          <div className={styles.createTime}>{timeAgo(data.time)}</div>
        </div>
      </div>

      {/* {
            data.status === 0
                ? (
                    isDelay ? <div className={styles.actionContent}>
                        <div className={styles.actionItem}>
                            {
                                isPrepaid && (isWithdrawed ? <div className={ styles.withdrawGrey }>Withdraw</div> : <div className={styles.withdraw} onClick={async () => {
                                    setIsLoading(true)
                                    const res = await prepaidSolWithdraw()

                                    if (!res) {
                                        fail('Withdraw fail')
                                    } else {
                                        success('Withdraw success')
                                        setIsWithdrawed(true)
                                    }
                                    setIsLoading(false)
                                }}>{isLoading ? <DotLoading /> : 'Withdraw'}</div>)
                            }
                        </div>
                    </div> : <div className={styles.actionContent}>
                        <div className={styles.actionItem}>
                            <div className={styles.actionIcon}>
                                <Boost
                                    token={data}
                                    isGrey={true}
                                    onClick={() => {
                                        update && update()
                                    }}
                                />
                            </div>
                            <div className={styles.actionTimes}>
                                {
                                    timeFormat ? <div className={styles.whiteAmount}>
                                        <div className={styles.timeFormat}>{timeFormat}</div>
                                    </div> : <div style={{ transform: 'translateX(-30%)', visibility: 'hidden' }}>-</div>
                                }
                            </div>
                        </div>

                        {
                            !hideHot && <div className={styles.actionItem}>
                                <div>
                                    <SmokeBtn token={data} onClick={() => {
                                        update && update()
                                    }} />
                                    <div className={styles.actionTimes}>
                                        <span className={styles.whiteAmount}>{data.superLike}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                ) : <div className={styles.actionContent}>
                    {
                        isPrepaid && (isClaimed ? <div className={styles.withdrawGrey}>Claimed</div> : <div className={styles.withdraw} onClick={async () => {
                            setIsLoading(true)
                            const res = await prepaidTokenWithdraw()
                            if (!res) {
                                fail('Claim fail')
                            } else {
                                success('Claim success')
                                setIsClaimed(true)
                            }
                            setIsLoading(false)
                        }}>{isLoading ? <DotLoading /> : 'Claim'}</div>)
                    }
                    <LauncdedAction data={data} justPlus={true} />
                </div>
        } */}

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
