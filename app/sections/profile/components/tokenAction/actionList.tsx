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
  onWithdrawSuccess?(): void;
}

export default function ActionList({
  token,
  isOther,
  prepaidWithdrawDelayTime,
  onWithdrawSuccess
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
    if (token.account === userInfo?.address) return false;
    if (token.isSuperLike) {
      return 1;
    }
    return 2;
  }, [token, userInfo]);

  const isDelay = useMemo(() => {
    return (
      prepaidWithdrawDelayTime &&
      token.createdAt &&
      Date.now() - token.createdAt > prepaidWithdrawDelayTime
    );
  }, [prepaidWithdrawDelayTime, token]);

  const showWithdraw = useMemo(
    () => isDelay && !isOther && isPrepaid,
    [isDelay, isOther, isPrepaid]
  );

  return (
    <div className={styles.Btns}>
      {token.status === 0 && (
        <>
          {
            // fix#REF-9370
            showWithdraw ? (
              <Withdraw
                {...{
                  prepaidSolWithdraw,
                  onSuccess: onWithdrawSuccess,
                }}
              />
            ) : (
              <>
                {!!smookeable && (smookeable === 1 ? (
                  <button className={`${styles.ActionBtn} ${styles.ProfileFlipDisabled} button`}>
                    <span>Flipped</span>
                  </button>
                ) : (
                  <SmokeHot
                    actionChildren={
                      <button className={`${styles.ActionBtn} ${styles.ProfileFlip} button`}>
                        <img src="/img/profile/icon-flip.svg" alt="" width="17px" height="21px" />
                        <span>Flip</span>
                      </button>
                    }
                    token={token}
                    onClick={() => {}}
                  />
                ))}
              </>
            )
          }
        </>
      )}

      {[1, 2, 3].includes(Number(token.status)) && !isOther && (
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
