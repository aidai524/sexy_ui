import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import Big from "big.js";
import styles from "./trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { getFullNum, httpGet } from "@/app/utils";
import { Avatar } from "@/app/components/thumbnail/avatar";
import { Checkbox } from "antd-mobile";
import type { Project } from "@/app/type";
import { fail } from "@/app/utils/toast";
import { useUserAgent } from "@/app/context/user-agent";
import Paid from "@/app/components/tag/Paid";

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
  setShowSuccessModal,
  width
}: any) {
  console.log('token:', token)

  const { tokenName, tokenSymbol, tokenUri } = token;

  const { isMobile } = useUserAgent();
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

  const validateSameName = useCallback(async () => {
    const tokenInUse = await httpGet(
      `/project?token_name=${tokenName}&token_symbol=${tokenSymbol.toUpperCase()}`
    );

    if (tokenInUse.code === 0 && tokenInUse.data?.length > 0) {
      return "Token name already in use";
    }

    return '';
  }, [tokenName, tokenSymbol])

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
    <div
      className={styles.Container}
      style={{ width, borderRadius: isMobile ? "20px 20px 0px 0px" : "20px" }}
    >
      <div className={styles.avatar}>
        <Avatar data={infoData} />
      </div>

      <div className={[styles.cationArea, styles.panel].join(" ")}>
        <div className={styles.inputArea}>
          <div className={styles.actionArea}>
            <div className={styles.slippage}>Flip (optional)</div>
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
                className={`${styles.percentTag} button`}
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
                      "button",
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
        <div className={styles.launchTip}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.0709 2.92908C17.9894 3.84747 18.7102 4.91678 19.214 6.10759C19.7355 7.34046 20 8.65023 20 10C20 11.3498 19.7355 12.6594 19.2141 13.8923C18.7103 15.0831 17.9894 16.1525 17.071 17.0708C16.1529 17.9892 15.0833 18.7102 13.8926 19.2139C12.6594 19.7354 11.35 20 10 20C8.65023 20 7.34057 19.7354 6.1077 19.2139C4.9169 18.7102 3.84747 17.9891 2.92931 17.0708C2.0108 16.1525 1.28977 15.0831 0.786092 13.8923C0.264713 12.6594 0 11.3498 0 10C0 8.65023 0.264713 7.34046 0.786092 6.10747C1.28977 4.91678 2.0108 3.84736 2.9292 2.92897C3.84747 2.0108 4.91713 1.28966 6.1077 0.785977C7.3408 0.264483 8.65034 0 10 0C11.3499 0 12.6597 0.264483 13.8925 0.785977C15.0832 1.28966 16.1528 2.01092 17.0709 2.92908ZM16.087 16.0869C16.8775 15.2962 17.4985 14.3755 17.932 13.3506C18.3807 12.2894 18.6082 11.1622 18.6082 10C18.6082 8.83782 18.3807 7.71046 17.9317 6.64943C17.4996 5.62652 16.873 4.69723 16.0868 3.9131C15.2961 3.12241 14.3756 2.50172 13.3506 2.06816C12.2893 1.61931 11.1622 1.39172 9.99989 1.39172C8.8377 1.39172 7.71046 1.61943 6.64931 2.06816C5.62651 2.50035 4.69731 3.12691 3.91322 3.9131C3.12696 4.69723 2.50039 5.62652 2.06828 6.64943C1.61931 7.71046 1.39184 8.83782 1.39184 10C1.39184 11.1622 1.61943 12.2894 2.06828 13.3506C2.50046 14.3734 3.12702 15.3027 3.91322 16.0869C4.70379 16.8776 5.62425 17.4983 6.64931 17.9318C7.71046 18.3807 8.8377 18.6082 9.99989 18.6082C11.1622 18.6082 12.2897 18.3806 13.3508 17.9318C14.3736 17.4996 15.3028 16.873 16.087 16.0869ZM9.99771 12.4578C10.3915 12.4578 10.7905 12.1646 10.8479 11.5371L11.3087 5.68379C11.3087 5.08851 10.6462 4.53667 10.031 4.53667C9.41598 4.53667 8.69104 5.06437 8.69104 5.66069L9.20564 11.5932C9.33323 12.2278 9.62368 12.3874 9.99771 12.4578ZM8.88564 14.3483C8.88564 13.7325 9.38483 13.2339 10 13.2339C10.6155 13.2339 11.1144 13.7333 11.1145 14.3483C11.1145 14.9641 10.6156 15.4634 10 15.4634C9.38426 15.4634 8.88564 14.9641 8.88564 14.3483Z"
              fill="#FBCA04"
            />
          </svg>
          <span>
            After successful creation, the creator will not be able to flip
            again
          </span>
        </div>
        <div style={{ marginTop: 20 }} className={styles.receiveTokenAmount}>
          <Checkbox
            onChange={() => {
              setLaunchChecked(!launchChecked);
            }}
            checked={launchChecked}
          />
          <div className={styles.receiveTitleWrapper}>
            <div className={styles.receiveTitlePaidWrapper}>
              <Paid
                style={{
                  height: 24,
                  fontSize: 12
                }}
              />
              <div className={styles.receiveTitlePaid}>0.1 SOL</div>
            </div>
            <div className={styles.receiveTitle}>
              For an additional 0.1 SOL, you can directly enter the Launching
              phase
            </div>
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

                const sameNameRes = await validateSameName()

                if (sameNameRes) {
                  setIsLoading(false);
                  fail(sameNameRes)
                }

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
                }

                setIsLoading(false);
                // success('Transtion success')
              } catch (e: any) {
                console.log(e, e.toString());
                setIsLoading(false);
                fail("Create token error");
              }
            }}
            style={{ background: "#FBCA04", color: "#000" }}
          >
            Create Coin
          </MainBtn>
        </div>
      </div>
    </div>
  );
}
