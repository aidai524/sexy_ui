import type { Project } from "@/app/type";
import styles from "./index.module.css";
import Boost from "@/app/components/boost";
import SmokeHot from "@/app/components/smokHot";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useEffect, useMemo, useState } from "react";
import BuySell from "./buySell";
import { useUser } from "@/app/store/useUser";
import Withdraw from "./withdraw";
import Claim from "./claim";
import FlipIcon from "./flip-icon";

interface Props {
  token: Project;
  isOther: boolean;
  prepaidWithdrawDelayTime: number;
}

export default function ActionList({
  token,
  isOther,
  prepaidWithdrawDelayTime
}: Props) {
  const [isPrepaid, setIsPrepaid] = useState(false);

  const [updateNum, setUpdateNum] = useState(1);
  const [isClaimed, setIsClaimed] = useState(false);

  const { userInfo }: any = useUser();

  const { prepaidSolWithdraw, prepaidTokenWithdraw, checkPrePayed } =
    useTokenTrade({
      tokenName: token.tokenName,
      tokenSymbol: token.tokenSymbol as string,
      tokenDecimals: token.tokenDecimals as number,
      loadData: false
    });

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
  }, [updateNum, isOther, token]);

  const smookeable = useMemo(() => {
    return !token.isSuperLike && token.account !== userInfo?.address;
  }, [token, userInfo]);

  return (
    <div className={styles.Btns}>
      {token.status === 0 && (
        <>
          <Withdraw
            {...{
              prepaidSolWithdraw,
              prepaidWithdrawDelayTime,
              token,
              isPrepaid,
              isOther
            }}
          />

          {smookeable && (
            <SmokeHot
              actionChildren={
                <button className={`${styles.ActionBtn} ${styles.Flip} button`}>
                  <FlipIcon />
                  <span>Flip</span>
                </button>
              }
              token={token}
              onClick={() => {}}
            />
          )}
        </>
      )}

      {[1, 2, 3].includes(Number(token.status)) && (
        <Claim
          {...{
            isPrepaid,
            isOther,
            prepaidTokenWithdraw,
            isClaimed,
            setIsClaimed
          }}
        />
      )}
      {[1, 3].includes(Number(token.status)) &&
        (!(isPrepaid && !isOther) || isClaimed) && <BuySell token={token} />}
    </div>
  );
}
