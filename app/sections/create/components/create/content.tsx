import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import Big from "big.js";
import styles from "./trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useLaptop } from "@/app/context/laptop";
import { getFullNum, httpGet } from "@/app/utils";
import { Avatar } from "@/app/components/thumbnail";
import { Checkbox } from "antd-mobile";
import type { Project } from "@/app/type";
import { fail } from "@/app/utils/toast";

type Token = {
  tokenName: string;
  tokenSymbol: string;
  tokenUri: string;
  tokenDecimals: number;
};

const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.01, 0.05, 35];

export default function Create({
  token,
  data,
  onHide,
  onCreateTokenSuccess,
  setShowSuccessModal
}: any) {
  const { tokenName, tokenSymbol, tokenUri } = token;
  const { updateUserInfo } = useLaptop();
  const [infoData, setInfoData] = useState<Project>({
    tokenName: tokenName,
    ticker: data.ticker,
    about: "",
    website: "",
    tokenImg: tokenUri,
    tokenIcon: data.tokenIcon
  });

  const [tokenType, setTokenType] = useState<number>(1);
  const [currentToken, setCurrentToken] = useState<Token>(SOL);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [solPercent, setSolPercent] = useState(0);
  const [valInput, setValInput] = useState("");
  const [launchChecked, setLaunchChecked] = useState(false);

  const { createToken } = useTokenTrade({
    tokenName,
    tokenSymbol,
    tokenDecimals: 6,
    loadData: false
  });

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
    if (!debounceVal) {
      setIsError(false);
      return;
    }

    if (debounceVal) {
      if (isNaN(Number(debounceVal))) {
        setIsError(true);
      }
      if (Number(debounceVal) > 0 && Number(debounceVal) <= 35) {
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  }, [debounceVal]);

  return (
    <>
      <div className={styles.avatar}>
        <Avatar data={infoData} />
      </div>

      <div className={[styles.cationArea, styles.panel].join(" ")}>
        <div className={styles.inputArea}>
          <div className={styles.actionArea}>
            <div className={styles.slippage}>Pre-Buy (optional)</div>
          </div>

          <div className={styles.inputArea}>
            <input
              value={valInput}
              onChange={(e) => {
                setValInput(e.target.value);
                setSolPercent(0);
              }}
              className={styles.input}
            />
            <div className={styles.inputToken}>
              <div className={styles.tokenName}>{currentToken.tokenName}</div>
              <div className={styles.tokenImg}>
                <img className={styles.tiImg} src={currentToken.tokenUri} />
              </div>
            </div>
          </div>

          {tokenType === 1 ? (
            <div className={styles.tokenPercent}>
              <div
                onClick={() => {
                  setSolPercent(0);
                  setValInput("");
                }}
                className={styles.percentTag}
              >
                Reset
              </div>
              {SOL_PERCENT_LIST.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setSolPercent(item);
                      setValInput(getFullNum(item));
                    }}
                    key={item}
                    className={[
                      styles.percentTag,
                      item === solPercent ? styles.tagActive : ""
                    ].join(" ")}
                  >
                    {getFullNum(item)}SOL
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 20 }} className={styles.receiveTokenAmount}>
          <Checkbox
            onChange={() => {
              setLaunchChecked(!launchChecked);
            }}
            checked={launchChecked}
          />
          <div className={styles.receiveTitle}>
            For an additional{" "}
            <strong style={{ color: "#C36EFF" }}>0.1SOL</strong>, you can
            directly enter the Launching phase
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <MainBtn
            isLoading={isLoading}
            isDisabled={isError}
            onClick={async () => {
              try {
                if (isLoading || isError) {
                  return;
                }

                setIsLoading(true);

                const hash = await createToken({
                  name: tokenName,
                  symbol: tokenSymbol,
                  uri: tokenUri,
                  launching: launchChecked,
                  amount: valInput
                    ? new Big(valInput).mul(10 ** 9).toString()
                    : ""
                });

                if (!hash) {
                  throw "Create token error";
                }

                const isSuccess = await onCreateTokenSuccess();
                if (isSuccess) {
                  onHide();
                  setShowSuccessModal(true);
                  updateUserInfo?.();
                }

                setIsLoading(false);
                // success('Transtion success')
              } catch (e: any) {
                console.log(e, e.toString());
                setIsLoading(false);
                fail("Create token error");
              }
            }}
            style={{ background: "rgba(255, 47, 116, 1)" }}
          >
            Create Coin
          </MainBtn>
        </div>
      </div>

      <div className={styles.launchTip}>
        After successful creation, the creator will not be able to Pre-buy again
      </div>
    </>
  );
}
