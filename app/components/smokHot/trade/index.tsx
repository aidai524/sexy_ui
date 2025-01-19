import { useEffect, useState, useMemo } from "react";
import styles from "./trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { Avatar } from "../../thumbnail/avatar";
import type { Project } from "@/app/type";
import Big from "big.js";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { fail, success } from "@/app/utils/toast";
import dayjs from "@/app/utils/dayjs";
import { useAccount } from "@/app/hooks/useAccount";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useUserAgent } from "@/app/context/user-agent";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";

interface Props {
  token: Project;
  onSuccess?: (amount: any) => void;
  panelStyle?: any;
  mainStyle?: any;
  bottomStyle?: any;
  modalShow: boolean;
  onClose?: () => void;
}

const max = 1;

export default function Trade({
  token,
  panelStyle,
  modalShow,
  onSuccess,
  onClose,
  mainStyle,
  bottomStyle
}: Props) {
  const [inputVal, setInputVal] = useState(max.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isPrePayd, setIsPrePayd] = useState(false);
  const { address } = useAccount();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { showShare } = useMessage();

  const { prePaid, checkPrePayed } = useTokenTrade({
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol as string,
    tokenDecimals: token.tokenDecimals as number,
    loadData: false
  });

  const delayTime = useMemo(() => {
    if (!prepaidDelayTime || !token.createdAt) return "";
    return Date.now() < token.createdAt + prepaidDelayTime
      ? dayjs(token.createdAt + prepaidDelayTime).format("YYYY-MM-DD HH:mm")
      : "";
  }, [prepaidDelayTime, token]);

  useEffect(() => {
    if (!address || address === token.account) {
      setIsPrePayd(true);
      return;
    }
    checkPrePayed().then((prdPaydval) => {
      setIsPrePayd(prdPaydval > 0);
    });
  }, [checkPrePayed, address, token]);

  useEffect(() => {
    if (!modalShow) {
      setInputVal(max.toString());
      setIsLoading(false);
    }
  }, [modalShow]);

  return (
    <div className={styles.main} style={mainStyle}>
      <div className={styles.avatar}>
        <Avatar data={token} showLaunchType={true} />
      </div>

      <div
        className={[styles.cationArea, styles.panel].join(" ")}
        style={panelStyle}
      >
        <div className={styles.inputArea}>
          <div className={styles.actionArea}>
            <div className={styles.switchToken}>
              <span className={styles.switchTitle}>Pre Buy</span>
            </div>
            <div className={styles.slippage}>Maximum {max} SOL</div>
          </div>

          <div className={styles.inputArea}>
            <input
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              className={styles.input}
            />
            <div className={styles.inputToken}>
              <div className={styles.tokenName}>SOL</div>
              <div className={styles.tokenImg}>
                <img className={styles.tiImg} src="/img/home/solana.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.Bottom} style={bottomStyle}>
        <div style={{ marginTop: 30 }} className={styles.receiveTokenAmount}>
          {isPrePayd ? (
            <div className={styles.receiveTitle}>
              You have bought this meme. You can view it on your account page。
            </div>
          ) : (
            <div className={styles.receiveTitle}>
              You will auto-buy in when this meme launching.{" "}
              {delayTime
                ? `You can refund after ${delayTime}.`
                : "You can refund anytime before launching."}
            </div>
          )}
        </div>
        <div style={{ marginTop: 18 }}>
          <MainBtn
            isDisabled={
              !inputVal ||
              Number(inputVal) > max ||
              isPrePayd ||
              Number(inputVal) <= 0
            }
            isLoading={isLoading}
            onClick={async () => {
              onSuccess?.(inputVal);
              return;
              try {
                if (inputVal) {
                  setIsLoading(true);
                  const inputNum = new Big(inputVal).mul(10 ** 9).toFixed(0);
                  const res = await prePaid(inputNum, false);
                  setIsLoading(false);
                  if (res) {
                    success("Flip success");
                    await actionLikeTrigger(token, showShare);
                    onSuccess?.(inputVal);
                  }
                }
              } catch (e: any) {
                console.log(e);
                fail(e.toString());
                setIsLoading(false);
              }
            }}
            style={{ backgroundColor: "#FBCA04", color: "#000" }}
          >
            Pre-Buy
          </MainBtn>
        </div>
      </div>
    </div>
  );
}
