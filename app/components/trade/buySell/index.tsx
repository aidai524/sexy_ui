import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import { BN } from "@coral-xyz/anchor";
import Big from "big.js";
import styles from "../trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { getFullNum } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import SlipPage from "../slippage/slippage";

type Token = {
  tokenName: string;
  tokenSymbol: string;
  tokenUri: string;
  tokenDecimals: number;
};

interface Props {
  token: Token;
  initType: string;
  from?: string;
}

const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.00000001, 0.00000005];

export default function BuySell({ token, initType, from }: Props) {
  const { tokenName, tokenSymbol, tokenUri } = token;
  const [showSlip, setShowSlip] = useState(false);
  const [slip, setSlip] = useState(0.5);

  const desToken: Token = {
    tokenName,
    tokenSymbol,
    tokenUri,
    tokenDecimals: 2
  };

  const [activeIndex, setActiveIndex] = useState(initType === "buy" ? 0 : 1);
  const [tokenType, setTokenType] = useState<number>(0);
  const [currentToken, setCurrentToken] = useState<Token>(desToken);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [solPercent, setSolPercent] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(1);

  const [valInput, setValInput] = useState("");

  const [buyIn, setBuyIn] = useState("0");
  const [buyInSol, setBuyInSol] = useState("0");

  const [sellOut, setSellOut] = useState("0");
  const [sellOutSol, setSellOutSol] = useState("0");

  const {
    buyToken,
    sellToken,
    rate,
    minPrice,
    maxPrice,
    tokenBalance,
    solBalance,
    updateBalance
  } = useTokenTrade({
    tokenName,
    tokenSymbol
  });

  const TOKEN_PERCENT_LIST = useMemo(() => {
    if (rate) {
      return [25, 50, 75, 100];
    }

    return [];
  }, [rate]);

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
    if (debounceVal && rate) {
      if (activeIndex === 0) {
        let buyInSol = "";
        if (tokenType === 1) {
          buyInSol = new Big(debounceVal)
            .mul(10 ** SOL.tokenDecimals)
            .toFixed(0);
          const buyIn = new Big(debounceVal).mul(rate).toFixed(2);
          setBuyIn(buyIn);
        } else if (tokenType === 0) {
          buyInSol = new Big(debounceVal)
            .div(new Big(rate))
            .mul(10 ** SOL.tokenDecimals)
            .toFixed(0);
          if (Number(buyInSol) > 1) {
            setBuyIn(debounceVal);
          } else {
            setBuyIn("");
            buyInSol = "";
          }
        }
        if (buyInSol) {
          setIsError(false);
          setErrorMsg("Enter a amount");
        }
        setBuyInSol(buyInSol);
      } else if (activeIndex === 1) {
        let sellOut = "";
        if (tokenType === 1) {
          sellOut = new Big(debounceVal)
            .mul(rate)
            .mul(10 ** token.tokenDecimals)
            .toFixed(0);
        } else if (tokenType === 0) {
          sellOut = new Big(debounceVal)
            .mul(10 ** token.tokenDecimals)
            .toFixed(0);
          const sellSolOut = new Big(debounceVal)
            .div(rate)
            .mul(10 ** SOL.tokenDecimals)
            .toFixed(0);

          console.log("sellSolOut:", sellSolOut);

          if (Number(sellSolOut) === 0) {
            setIsError(true);
            setErrorMsg("Amount is too little");
            setSellOut("");
          } else {
            setSellOut(sellOut);
            setSellOutSol(
              getFullNum(
                new Big(sellSolOut).div(10 ** SOL.tokenDecimals).toString()
              )
            );
            if (sellOut) {
              setIsError(false);
              setErrorMsg("Enter a amount");
            }
          }
        }
      }
    } else {
      setBuyIn("");
      setBuyInSol("");
      setSellOut("");
      setIsError(true);
      setErrorMsg("Enter a amount");
    }
  }, [debounceVal, rate, tokenType, currentToken]);

  return (
    <div>
      <div
        className={[
          styles.cationArea,
          from === "laptop" ? styles.LaptopMain : styles.panel
        ].join(" ")}
      >
        <div className={styles.tradeTabs}>
          <div
            onClick={() => {
              setActiveIndex(0);
            }}
            className={[
              styles.tab,
              activeIndex === 0 ? styles.active : null
            ].join(" ")}
          >
            Buy
          </div>
          <div
            onClick={() => {
              setActiveIndex(1);
              setCurrentToken(desToken);
              setTokenType(0);
            }}
            className={[
              styles.tab,
              activeIndex === 1 ? styles.active : null
            ].join(" ")}
          >
            Sell
          </div>
        </div>

        <div className={styles.inputArea}>
          <div className={styles.actionArea}>
            {activeIndex === 0 ? (
              <div
                className={styles.switchToken}
                onClick={() => {
                  if (tokenType === 0) {
                    setCurrentToken(SOL);
                    setTokenType(1);
                    setValInput("");
                  } else {
                    setCurrentToken(desToken);
                    setTokenType(0);
                    setValInput("");
                  }
                }}
              >
                <span className={styles.switchTitle}>switch to </span>
                <span className={styles.switchTokenName}>
                  {tokenType === 0 ? SOL.tokenName : tokenName}
                </span>
              </div>
            ) : (
              <div></div>
            )}

            <div
              onClick={() => {
                setShowSlip(true);
              }}
              className={styles.slippage}
            >
              Set max slippage
            </div>
          </div>

          <div className={styles.tokenBalanceBox}>
            <div className={styles.inputArea}>
              <input
                value={valInput}
                onChange={(e) => {
                  setValInput(e.target.value);
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
            <div className={styles.balance}>
              Balance:{" "}
              {tokenType === 0
                ? tokenBalance + currentToken.tokenName
                : solBalance + "SOL"}
            </div>
          </div>

          {activeIndex === 0 &&
            (tokenType === 1 ? (
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
            ) : (
              <div className={styles.paid}>
                <div>You will paid by</div>
                <div>
                  {buyInSol &&
                    new Big(buyInSol)
                      .div(10 ** SOL.tokenDecimals)
                      .toFixed()}{" "}
                  SOL
                </div>
              </div>
            ))}

          {activeIndex === 1 && (
            <div className={styles.tokenPercent}>
              <div
                onClick={() => {
                  setTokenPercent(0);
                  setValInput("");
                }}
                className={styles.percentTag}
              >
                Reset
              </div>
              {TOKEN_PERCENT_LIST.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setTokenPercent(item);
                      const tokenPercentVal = new Big(tokenBalance)
                        .mul(item / 100)
                        .toFixed(2);
                      console.log("item:", item, tokenBalance, tokenPercentVal);
                      setValInput(tokenPercentVal);
                    }}
                    key={item}
                    className={[
                      styles.percentTag,
                      item === tokenPercent ? styles.tagActive : ""
                    ].join(" ")}
                  >
                    {item}%
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activeIndex === 0 && tokenType === 1 && (
          <div style={{ marginTop: 30 }} className={styles.receiveTokenAmount}>
            <div className={styles.receiveTitle}>You will buy in</div>
            <div className={styles.receiveAmount}>
              {buyIn} {tokenName}
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div style={{ marginTop: 30 }} className={styles.receiveTokenAmount}>
            <div className={styles.receiveTitle}>You will pay</div>
            <div className={styles.receiveAmount}>{sellOutSol} SOL</div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <MainBtn
            isLoading={isLoading}
            isDisabled={isError}
            onClick={async () => {
              try {
                if (isLoading || isError) {
                  return;
                }

                if (activeIndex === 0) {
                  setIsLoading(true);
                  await buyToken(buyInSol);
                } else if (activeIndex === 1) {
                  setIsLoading(true);
                  await sellToken(sellOut);
                }
                setIsLoading(false);
                success("Transtion success");
                updateBalance();
              } catch (e) {
                console.log(e);
                setIsLoading(false);
                fail("Transtion fail");
              }
            }}
            style={{
              background:
                activeIndex === 0
                  ? "rgba(109, 181, 0, 1)"
                  : "rgba(255, 47, 116, 1)"
            }}
          >
            Place Trade
          </MainBtn>
        </div>
      </div>

      <SlipPage
        show={showSlip}
        slipData={slip}
        token={token}
        onSlipDataChange={(val: any) => {
          setSlip(val);
        }}
        onHide={() => {
          setShowSlip(false);
        }}
      />
    </div>
  );
}
