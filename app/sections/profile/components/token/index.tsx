import { useEffect, useMemo, useState } from "react";
import styles from "./token.module.css";
import type { Project } from "@/app/type";
import { simplifyNum } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import TokenAction from "../tokenAction";
import useMc from "@/app/hooks/useMc";
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';
import { SOL } from '@/app/components/trade/buySellPump';
import { useUser } from '@/app/store/useUser';
import { Program } from '@coral-xyz/anchor';
import idl from '@/app/hooks/meme_launchpad.json';
import { useConnection } from '@solana/wallet-adapter-react';

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
  const { connection } = useConnection();

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
    programId,
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
      setPrepaidRealAmount(Big(0));
      setPrepaidAmount(Big(0));
      return;
    }
    checkPrePayed().then((res) => {
      const _amount = Big(res || 0).div(10 ** SOL.tokenDecimals);
      setPrepaidRealAmount(_amount);
      setPrepaidAmount(Big(_amount).div(0.985));
    });
  }, [isOther, data]);

  useEffect(() => {
    if (pool && pool.length) {
      const program = new Program<any>(idl, programId, {
        connection: connection
      } as any);
      program.account.pool.fetch(pool[0]).then((poolData: any) => {
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
      }).catch((err) => {
        console.log('%cCalc token amount failed - %o: %o', 'background:#ff5f00;color:#fff;', data.tokenSymbol, err);
        setTokenAmount(Big(0));
      });
      return;
    }
    setTokenAmount(Big(0));
  }, [pool, data, prepaidRealAmount]);

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
            src={data.tokenImg || "/img/token-placeholder.png"}
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
                  backgroundImage: `url("${data.tokenIcon || '/img/token-placeholder.png'}")`,
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
