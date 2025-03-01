import { useEffect, useMemo, useState } from "react";
import styles from "./token.module.css";
import type { Project } from "@/app/type";
import { simplifyNum } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import TokenAction from "../tokenAction";
import useMc from "@/app/hooks/useMc";
import { formatLongText, numberFormatter } from "@/app/utils/common";
import Big from "big.js";
import { SOL } from "@/app/components/trade/buySellPump";
import { useUser } from "@/app/store/useUser";
import { Program } from "@coral-xyz/anchor";
import idl from "@/app/hooks/meme_launchpad.json";
import { useConnection } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import Media from "@/app/components/thumbnail/media";
import { useUserAgent } from "@/app/context/user-agent";

interface Props {
  data: Project;
  update: () => void;
  prepaidWithdrawDelayTime: number;
  hideHot?: boolean;
  from?: string;
  type?: string;
  isOther: boolean;
  onWithdrawSuccess?(): void;
}

export default function Token({
  data,
  update,
  prepaidWithdrawDelayTime,
  hideHot,
  type,
  from,
  isOther,
  onWithdrawSuccess
}: Props) {
  const router = useRouter();
  const { userInfo }: any = useUser();
  const { connection } = useConnection();
  const { isMobile } = useUserAgent();

  const [mc, setMC] = useState<string | number>(0);
  const [prepaidRealAmount, setPrepaidRealAmount] = useState(Big(0));
  const [prepaidAmount, setPrepaidAmount] = useState(Big(0));
  const [tokenAmount, setTokenAmount] = useState(Big(0));

  const { mc: pumpMc } = useMc({
    tokenAddress: data?.address,
    disable: data?.status! < 1
  });

  const {
    getMC,
    pool,
    checkPrePayed,
    prepaidSolWithdraw,
    prepaidTokenWithdraw,
    programId
  } = useTokenTrade({
    tokenName: data?.tokenName as string,
    tokenSymbol: data?.tokenSymbol as string,
    tokenDecimals: data?.tokenDecimals as number,
    loadData: false
  });

  const isPrepaid = useMemo(() => {
    return Big(prepaidAmount || 0).gt(0);
  }, [prepaidAmount]);

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
    if (data.isSuperLike) {
      return 1;
    }
    // fix#REF-9596 👇
    if (data.account === userInfo?.address) return false;
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
  }, [
    pool,
    data?.tokenName,
    data?.tokenSymbol,
    data?.tokenDecimals,
    data?.DApp,
    data?.status
  ]);

  useEffect(() => {
    if (
      isOther ||
      (!data?.isSuperLike && data?.account !== userInfo?.address)
    ) {
      setPrepaidRealAmount(Big(0));
      setPrepaidAmount(Big(0));
      return;
    }
    checkPrePayed().then((res) => {
      const _amount = Big(res || 0).div(10 ** SOL.tokenDecimals);
      setPrepaidRealAmount(_amount);
      setPrepaidAmount(Big(_amount).div(0.985));
    });
  }, [
    type,
    isOther,
    data?.tokenName,
    data?.tokenSymbol,
    data?.tokenDecimals,
    data?.isSuperLike,
    userInfo?.address
  ]);

  useEffect(() => {
    if (
      pool &&
      pool.length &&
      (showWithdraw ||
        (Number(prepaidRealAmount) > 0 && Number(data?.status || 0) > 0))
    ) {
      const program = new Program<any>(idl, programId, {
        connection: connection
      } as any);
      program.account.pool
        .fetch(pool[0])
        .then((poolData: any) => {
          let { prepaidAmount, prepaidBoughtTokenAmount } = poolData || {};
          prepaidAmount = Big(prepaidAmount.toNumber());
          prepaidBoughtTokenAmount = Big(prepaidBoughtTokenAmount.toNumber());
          const _tokenAmount = Big(prepaidRealAmount)
            .times(10 ** SOL.tokenDecimals)
            .div(prepaidAmount)
            .times(prepaidBoughtTokenAmount)
            .div(10 ** (data?.tokenDecimals || 6));
          setTokenAmount(_tokenAmount);

          // console.log(
          //   '%c[TokenAmount - %o] prepaidRealAmount: %o, prepaidAmount: %o, prepaidBoughtTokenAmount: %o, _tokenAmount: %o',
          //   'background:#ff5f00;color:#fff;',
          //   data.tokenSymbol,
          //   prepaidRealAmount.toString(),
          //   prepaidAmount.toString(),
          //   prepaidBoughtTokenAmount.toString(),
          //   _tokenAmount.toString(),
          // );
        })
        .catch((err) => {
          // console.log('%cCalc token amount failed - %o: %o', 'background:#ff5f00;color:#fff;', data.tokenSymbol, err);
          setTokenAmount(Big(0));
        });
      return;
    }
    setTokenAmount(Big(0));
  }, [pool, data, data?.tokenDecimals, prepaidRealAmount, showWithdraw]);

  return (
    <div
      className={styles.main}
      style={{
        width: from === "page" ? 340 : "100%",
        backgroundColor:
          from === "page" ? "transparent" : "rgba(255, 255, 255, 0.08)",
        flexDirection: from === "page" ? "column" : "row",
        gap: from === "page" ? 10 : 0,
        padding: from === "page" ? 0 : "10px 15px",
        alignItems: from === "page" ? "flex-start" : "center"
      }}
      onClick={() => {
        router.push("/detail?address=" + data.address + "&from=profile");
      }}
    >
      <div
        className={isMobile ? styles.tokenMagMobile : styles.tokenMag}
        style={{
          height: from === "page" ? 112 : "auto",
          // width: from === "page" ? "100%" : "auto",
          backgroundColor:
            from === "page" ? "rgba(255, 255, 255, 0.05)" : "transparent",
          padding: from === "page" ? "4px 12px 15px" : 0,
          borderRadius: from === "page" ? 10 : 0
        }}
      >
        <div className={`${styles.tokenImgContent}`}>
          <Media
            data={{
              ...data,
              tokenImg: data.tokenIcon || data.tokenImg,
            }}
            imgHeight={84}
            autoPlay={false}
            imgStyle={{
              width: 84,
              borderRadius: 7,
            }}
            style={{
              overflow: "hidden",
              borderRadius: 7,
            }}
            videoStyle={{
              height: "100%",
              background: "#000",
              borderRadius: 7,
            }}
          />
          <LaunchTag type={data.status as number} />
        </div>

        <div
          className={isMobile ? styles.nameContent : styles.nameContentLaptop}
        >
          <div className={styles.name}>
            {formatLongText(data.tokenName, 15, 4)}
          </div>
          <div className={styles.trikerContent}>
            <div className={styles.tickerName}>
              <div className={styles.tickerNameText}>Ticker: {data.ticker}</div>
              <div
                className={styles.tickerNameAvatar}
                style={{
                  backgroundImage: `url("${
                    data.tokenIcon || "/img/token-placeholder.png"
                  }")`,
                  border:
                    data.status === 0 && !!smookeable && !showWithdraw
                      ? `${
                          smookeable === 1
                            ? "1px dashed #FFF"
                            : "1px dashed #9290B1"
                        }`
                      : ""
                }}
              />
            </div>
          </div>
          {data?.status === 0 ? (
            <>
              {/*<div className={styles.trikerContent}>
                <div className={styles.Likes}>
                  <div>
                    Likes: <span style={{ color: "white" }}>{data?.like}</span>
                    /100
                  </div>
                  <img
                    src="/img/profile/icon-like.svg"
                    alt=""
                    width={13}
                    height={11}
                  />
                </div>
              </div>*/}
              <div className={styles.trikerContent}>
                <div className={styles.tickerName}>
                  Flipped:{" "}
                  {numberFormatter(
                    Big(data?.prePaidAmount || 0).div(10 ** SOL.tokenDecimals),
                    2,
                    true
                  )}{" "}
                  SOL
                </div>
              </div>
            </>
          ) : (
            <div className={styles.MarketCap}>
              MarketCap:{" "}
              {pumpMc || mc ? `$${simplifyNum(Number(pumpMc || mc), 2)}` : "-"}
            </div>
          )}
        </div>
      </div>

      <div
        className={isMobile ? styles.BottomMobile : styles.Bottom}
        style={{
          width: from === "page" ? "100%" : "auto"
        }}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
      >
        {from === "page" && (
          <div className={styles.Time}>{dayjs(data.time).fromNow()}</div>
        )}
        <TokenAction
          isOther={isOther}
          isDelay={isDelay}
          token={data}
          prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
          onWithdrawSuccess={onWithdrawSuccess}
          prepaidRealAmount={prepaidRealAmount}
          prepaidAmount={prepaidAmount}
          smookeable={smookeable}
          showWithdraw={showWithdraw}
          isPrepaid={isPrepaid}
          prepaidSolWithdraw={prepaidSolWithdraw}
          prepaidTokenWithdraw={prepaidTokenWithdraw}
          tokenAmount={tokenAmount}
        />
      </div>
    </div>
  );
}

function LaunchTag({ type }: { type: number }) {
  if (type === 0) {
    return (
      <div className={styles.launchTag + " " + styles.launch1}>Genesis</div>
    );
  }

  if (type === 1) {
    return (
      <div className={styles.launchTag + " " + styles.launch2}>Ticking</div>
    );
  }

  if (type === 3) {
    return (
      <div className={styles.launchTag + " " + styles.launch3}>Listed</div>
    );
  }
}
