import { useState } from "react";
import styles from "./index.module.css";
import HomeIcon from "@/app/components/icons/home";
import CircleLoading from "@/app/components/icons/loading";
import Button from "./button";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useDebounceFn } from "ahooks";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";
import Big from "big.js";

export default function Flip({ token, onSuccess, id, onClick }: any) {
  const [x, setX] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showShare } = useMessage();
  const { prePaid } = useTokenTrade({
    tokenName: token?.tokenName,
    tokenSymbol: token?.tokenSymbol,
    tokenDecimals: token?.tokenDecimals,
    loadData: false
  });

  const { run } = useDebounceFn(
    async () => {
      if (!window.sexAddress) {
        window.connect();
        return;
      }
      try {
        setLoading(true);
        await prePaid(0.1 * 1e8);
        actionLikeTrigger(token, showShare);
        const params: any = {
          isSuperLike: true,
          total_amount: Number(token.total_amount) + 0.1,
          prePaid: token.prePaid + 1,
          prePaidAmount: Big(token.prePaidAmount || 0)
            .add(Number(0.1) * 1e9)
            .toString(),
          isLike: true,
          like: token.like + 1
        };

        onSuccess(params);
      } catch (err) {
      } finally {
        setLoading(false);
        setX(0);
      }
    },
    { wait: 500 }
  );

  if (token.account === window.sexAddress) {
    return null;
  }

  return (
    <>
      <div className={styles.Container} id={id}>
        <Button
          className={styles.FlipButton}
          onClick={onClick}
          {...{ x, run, setX }}
        >
          {loading ? (
            <CircleLoading size={20} />
          ) : (
            <HomeIcon size={28} type="black" />
          )}
          <span>{loading ? "0.1 SOL" : "Flip it!"}</span>
        </Button>
        {loading && <div className={styles.Hints}>Quick Buy</div>}
        {!loading && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="16"
              viewBox="0 0 27 16"
              fill="none"
            >
              <path
                d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM26.7071 8.70711C27.0976 8.31658 27.0976 7.68342 26.7071 7.2929L20.3431 0.928934C19.9526 0.538409 19.3195 0.538409 18.9289 0.928934C18.5384 1.31946 18.5384 1.95262 18.9289 2.34315L24.5858 8L18.9289 13.6569C18.5384 14.0474 18.5384 14.6805 18.9289 15.0711C19.3195 15.4616 19.9526 15.4616 20.3431 15.0711L26.7071 8.70711ZM1 9L3.08333 9L3.08333 7L1 7L1 9ZM7.25 9L11.4167 9L11.4167 7L7.25 7L7.25 9ZM15.5833 9L19.75 9L19.75 7L15.5833 7L15.5833 9ZM23.9167 9L26 9L26 7L23.9167 7L23.9167 9Z"
                fill="white"
                fillOpacity="0.3"
              />
            </svg>
            <div className={styles.Right}>
              <div className={styles.Label}>Quick buy</div>
              <div className={styles.Value}>0.1 SOL</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
