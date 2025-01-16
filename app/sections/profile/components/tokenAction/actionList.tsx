import type { Project } from "@/app/type";
import styles from "./index.module.css";
import SmokeHot from "@/app/components/smokHot";
import { useState } from "react";
import BuySell from "./buySell";
import Withdraw from "./withdraw";
import Claim from "./claim";
import Big from 'big.js';

interface Props {
  token: Project;
  isOther: boolean;
  isDelay: boolean;
  prepaidWithdrawDelayTime: number;
  prepaidRealAmount: Big.Big;
  prepaidAmount: Big.Big;
  smookeable: false | 1 | 2;
  showWithdraw: boolean;
  isPrepaid: boolean;
  prepaidSolWithdraw: any;
  prepaidTokenWithdraw: any;
  tokenAmount: Big.Big;
  onWithdrawSuccess?(): void;
}

export default function ActionList(props: Props) {
  const {
    token,
    isOther,
    onWithdrawSuccess,
    smookeable,
    showWithdraw,
    isPrepaid,
    prepaidSolWithdraw,
    prepaidTokenWithdraw,
  } = props;

  const [isClaimed, setIsClaimed] = useState(false);

  return (
    <div className={styles.Btns}>
      {token.status === 0 && (
        <>
          {
            // fix#REF-9370
            showWithdraw ? (
              <Withdraw
                {...props}
                onSuccess={onWithdrawSuccess}
                prepaidSolWithdraw={prepaidSolWithdraw}
              />
            ) : (
              <>
                {!!smookeable && (smookeable === 1 ? (
                  /*<button className={`${styles.ActionBtn} ${styles.ProfileFlipDisabled} button`}>
                    <span>Flipped</span>
                  </button>*/
                  <></>
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
          {...props}
          isClaimed={isClaimed}
          setIsClaimed={setIsClaimed}
          prepaidTokenWithdraw={prepaidTokenWithdraw}
        />
      )}

      {[1, 3].includes(Number(token.status)) && (!(isPrepaid && !isOther) || isClaimed) && (
        <BuySell token={token} />
      )}
    </div>
  );
}
