import { useRef, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import Big from "big.js";
import styles from "../trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { getFullNum, getPointByVolume, getTransaction } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import SlipPage from "../slippage";
import TradeSuccessModal from "@/app/components/tradeSuccessModal";
import { Button, Modal } from "antd-mobile";
import type { Project } from "@/app/type";
import Tabs from "@/app/components/tabs";
import { useUser } from "@/app/store/useUser";
import usePump from "@/app/hooks/usePump";
import { useSlip } from "@/app/store/useSlip";
import useBalance from "@/app/hooks/useBalance";
import { useConnection } from "@solana/wallet-adapter-react";

type Token = {
  tokenName: string;
  tokenSymbol: string;
  tokenUri: string;
  tokenDecimals: number;
};

interface Props {
  token: Project;
  initType: string;
  from?: string;
  show?: boolean;
  onClose: () => void;
}

export const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.1, 0.5, 1];

export default function BuySellPump({
  token,
  initType,
  from,
  show,
  onClose
}: Props) {
  const { tokenName, tokenSymbol, tokenDecimals } = token;
  const [showSlip, setShowSlip] = useState(false);
  const { slip, set: setSlip }: any = useSlip();
  const tokenUri =
    token.tokenIcon || token.tokenImg || "/img/token-icon-placeholder.svg";
  const slippageTextRef = useRef<any>();

  const desToken: Token = {
    tokenName,
    tokenSymbol: tokenSymbol as string,
    tokenUri,
    tokenDecimals: tokenDecimals as number
  };

  const [activeIndex, setActiveIndex] = useState(initType === "buy" ? 0 : 1);
  const [tokenType, setTokenType] = useState<number>(1);
  const [currentToken, setCurrentToken] = useState<Token>(SOL);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [successMoalShow, setSuccessMoalShow] = useState(true);

  const [solPercent, setSolPercent] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(1);

  const [valInput, setValInput] = useState("");

  const [buyIn, setBuyIn] = useState("0");
  const [buyInSol, setBuyInSol] = useState("0");

  const [sellOut, setSellOut] = useState("0");
  const [sellOutSol, setSellOutSol] = useState("0");
  const [reFreshBalnace, setReFreshBalnace] = useState(1);

  const { userInfo }: any = useUser();

  useEffect(() => {
    if (initType === "buy") {
      setActiveIndex(0);
      setTokenType(1);
      setCurrentToken(SOL);
    } else {
      setActiveIndex(1);
      setCurrentToken(desToken);
      setTokenType(0);
    }
  }, [initType, show]);

  const { solBalance, tokenBalance } = useBalance({
    mint: token.address as string,
    tokenDecimals: token.tokenDecimals as number,
    reFreshBalnace: reFreshBalnace
  });
  const { connection } = useConnection();

  const { buy, sell, estimateToken, estimateSol } = usePump({
    tokenAddress: token.address as string
  });

  const TOKEN_PERCENT_LIST = useMemo(() => {
    return [25, 50, 75, 100];
  }, []);

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
    try {
      if (debounceVal) {
        setIsError(false);
        setIsLoading(true);
        if (activeIndex === 0) {
          let buyInSol = "";

          if (tokenType === 1) {
            if (Number(debounceVal) <= 0) {
              setIsError(true);
              setErrorMsg("Invalid value");
              setIsLoading(false);
              return;
            }

            estimateToken(
              new Big(debounceVal).mul(10 ** SOL.tokenDecimals).toNumber(),
              slip / 100
            )
              .then((res) => {
                setBuyInSol(debounceVal);
                setBuyIn(new Big(res).toFixed(desToken.tokenDecimals));

                if (Number(debounceVal) > Number(solBalance)) {
                  setIsError(true);
                  setIsLoading(false);
                  setErrorMsg("Invalid balance");
                  return;
                }

                setIsLoading(false);
                setIsError(false);
              })
              .catch((e) => {
                setIsLoading(false);
                setIsError(false);
              });
          } else if (tokenType === 0) {
            if (Number(debounceVal) <= 0) {
              setIsError(true);
              setErrorMsg("Invalid value");
              return;
            }

            estimateSol(
              new Big(debounceVal).mul(10 ** desToken.tokenDecimals).toNumber(),
              slip / 100
            )
              .then((res) => {
                setBuyIn(debounceVal);
                setBuyInSol(
                  new Big(res).div(10 ** SOL.tokenDecimals).toString()
                );

                setIsLoading(false);
                setIsError(false);
              })
              .catch((e) => {
                setIsLoading(false);
                setIsError(false);
              });
          }
        } else if (activeIndex === 1) {
          let sellOut = "";
          let sellSolOut = "";
          if (tokenType === 1) {
          } else if (tokenType === 0) {
            if (Number(debounceVal) <= 0) {
              setIsError(true);
              setIsLoading(false);
              setErrorMsg("Invalid value");
              return;
            }

            const sellOut = new Big(debounceVal)
              .mul(10 ** desToken.tokenDecimals)
              .toFixed(0);

            estimateSol(
              new Big(debounceVal).mul(10 ** desToken.tokenDecimals).toNumber(),
              slip / 100
            )
              .then((res) => {
                setSellOutSol(
                  new Big(res).div(10 ** SOL.tokenDecimals).toString()
                );

                if (Number(debounceVal) > Number(tokenBalance)) {
                  setIsError(true);
                  setIsLoading(false);
                  setErrorMsg("Invalid balance");
                  // setSellOutSol(getFullNum(sellSolOut));
                  return;
                }

                setSellOut(sellOut);
                setIsLoading(false);
                setIsError(false);
              })
              .catch((e) => {
                setIsLoading(false);
                setIsError(false);
              });
          }
        }
      } else {
        setBuyIn("");
        setBuyInSol("");
        setSellOut("");
        setSellOutSol("");
        setIsError(true);
        setErrorMsg("Enter a amount");
      }
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      setErrorMsg("Invalid value");
    }
  }, [debounceVal, tokenType, slip, currentToken]);

  return (
    <>
      <div className={[styles.cationArea].join(" ")}>
        {from === "panel" ? (
          <Tabs
            tabs={[
              {
                label: "Buy",
                key: 0
              },
              {
                label: "Sell",
                key: 1
              }
            ]}
            type="center"
            currentTab={activeIndex}
            onChangeTab={(index: number) => {
              setActiveIndex(index);
              setValInput("");
              if (index === 0) {
                setCurrentToken(SOL);
                setTokenType(1);
              } else {
                setCurrentToken(desToken);
                setTokenType(0);
              }
              setSolPercent(0);
              setTokenPercent(0);
            }}
            style={{
              backgroundColor: "#1B1B1B"
            }}
          />
        ) : (
          <div className={styles.tradeTabs}>
            <div
              onClick={() => {
                setActiveIndex(0);
                setCurrentToken(SOL);
                setTokenType(1);
                setValInput("");
                setSolPercent(0);
                setTokenPercent(0);
              }}
              className={[
                styles.tab,
                activeIndex === 0 ? styles.active : null,
                "button"
              ].join(" ")}
            >
              Buy
            </div>
            <div
              onClick={() => {
                setActiveIndex(1);
                setCurrentToken(desToken);
                setTokenType(0);
                setValInput("");
                setSolPercent(0);
                setTokenPercent(0);
              }}
              className={[
                styles.tab,
                activeIndex === 1 ? styles.active : null,
                "button"
              ].join(" ")}
            >
              Sell
            </div>
          </div>
        )}

        <div
          className={from === "panel" ? styles.PanelContent : styles.Content}
        >
          <div
            className={styles.inputArea}
            style={
              {
                // width: from === "panel" ? 335 : "100%"
              }
            }
          >
            <div className={styles.actionArea}>
              <div></div>
              <div
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.nativeEvent.stopImmediatePropagation();
                  setShowSlip(true);
                }}
                className={`${styles.slippage}`}
                ref={slippageTextRef}
              >
                <span className="button">Set max slippage</span>
              </div>
            </div>

            <div
              className={`${styles.tokenBalanceBox} ${
                from === "panel" && styles.PanelInput
              }`}
            >
              <div className={styles.inputArea}>
                <input
                  value={valInput}
                  onChange={(e) => {
                    setValInput(e.target.value);
                    if (activeIndex === 1) {
                      setTokenPercent(0);
                      TOKEN_PERCENT_LIST.forEach((percent) => {
                        const tokenPercentVal = new Big(tokenBalance)
                          .mul(percent / 100)
                          .toFixed(percent === 100 ? tokenDecimals : 2, 0);

                        if (
                          Number(tokenPercentVal) === Number(e.target.value)
                        ) {
                          setTokenPercent(percent);
                        }
                      });
                    } else if (activeIndex === 0) {
                      setSolPercent(0);
                      setTokenPercent(0);
                      SOL_PERCENT_LIST.map((item) => {
                        if (Number(item) === Number(e.target.value)) {
                          setSolPercent(Number(item));
                        }
                      });
                    }
                  }}
                  className={`${styles.input}`}
                />
                <div className={styles.inputToken}>
                  <div className={styles.tokenName}>
                    {currentToken.tokenName}
                  </div>
                  <div className={styles.tokenImg}>
                    <img className={styles.tiImg} src={currentToken.tokenUri} />
                  </div>
                </div>
              </div>
              <div className={styles.balance}>
                Balance: {tokenType === 0 ? tokenBalance : solBalance}
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
                    className={`${
                      from === "panel"
                        ? styles.PanelPercentTag
                        : styles.percentTag
                    } button`}
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
                          from === "panel"
                            ? styles.PanelPercentTag
                            : styles.percentTag,
                          item === solPercent ? styles.tagActive : "",
                          "button"
                        ].join(" ")}
                      >
                        {getFullNum(item)}SOL
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.paid}>
                  <div>Payment</div>
                  <div>{buyInSol && buyInSol} SOL</div>
                </div>
              ))}

            {activeIndex === 1 && (
              <div className={styles.tokenPercent}>
                <div
                  onClick={() => {
                    setTokenPercent(0);
                    setValInput("");
                  }}
                  className={`${
                    from === "panel"
                      ? styles.PanelPercentTag
                      : styles.percentTag
                  } button`}
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
                          .toFixed(item === 100 ? tokenDecimals : 2, 0);
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

          <div
            className={
              from === "panel"
                ? styles.receiveAmountWrapper
                : styles.receiveAmountWrapperMobile
            }
          >
            {activeIndex === 0 && tokenType === 1 && (
              <div className={styles.receiveTokenAmount}>
                <div className={styles.receiveTitle}>Received</div>
                <div className={styles.receiveAmount}>
                  {buyIn
                    ? new Big(buyIn)
                        .div(10 ** token.tokenDecimals!)
                        .toFixed(token.tokenDecimals)
                    : ""}{" "}
                  {tokenName}
                </div>
              </div>
            )}

            {activeIndex === 0 && tokenType === 0 && (
              <div className={styles.paid}>
                <div>Payment</div>
                <div>{buyInSol && buyInSol} SOL</div>
              </div>
            )}

            {activeIndex === 1 && (
              <div className={styles.receiveTokenAmount}>
                <div className={styles.receiveTitle}>Received</div>
                <div className={styles.receiveAmount}>
                  {sellOutSol && sellOutSol} SOL
                </div>
              </div>
            )}

            <div style={{ marginTop: from === "panel" ? 0 : 18 }}>
              <MainBtn
                isLoading={isLoading}
                isDisabled={isError}
                onClick={async () => {
                  // trade()

                  try {
                    if (isLoading || isError) {
                      return;
                    }

                    let hash;
                    let showBuyInToken = buyIn;
                    if (activeIndex === 0) {
                      setIsLoading(true);
                      hash = await buy(Number(buyInSol), slip / 100);
                      if (hash) {
                        // hash = '4XBoqSoGTcz7LbAJcfEWZf2wNhXjtbrNu27uDpaFC6pdnGMybyw1zs9m982RgQBKhEQYbABZKbDyLj5NPkFvtvDE'
                        const _showBuyInToken = await getTransaction(
                          connection,
                          hash,
                          token.address as string,
                          userInfo.address
                        );
                        if (_showBuyInToken) {
                          showBuyInToken = _showBuyInToken;
                        }
                      }
                      setIsLoading(true);
                    } else if (activeIndex === 1) {
                      setIsLoading(true);

                      hash = await sell(Number(sellOut), slip / 100);
                    }
                    setIsLoading(false);
                    setReFreshBalnace(reFreshBalnace + 1);

                    if (hash) {
                      const volume = activeIndex === 0 ? buyInSol : sellOutSol;
                      const pointByVolume = await getPointByVolume(
                        Big(volume).toFixed(SOL.tokenDecimals),
                        "pump"
                      );

                      const modalHandler = Modal.show({
                        content: (
                          <TradeSuccessModal
                            type={activeIndex}
                            userInfo={userInfo}
                            token={token}
                            solAmount={
                              activeIndex === 0 ? buyInSol : sellOutSol
                            }
                            amount={new Big(
                              activeIndex === 0 ? showBuyInToken : sellOut
                            )
                              .div(10 ** token.tokenDecimals!)
                              .toFixed(2)}
                            point={pointByVolume}
                            onClose={() => {
                              modalHandler.close();
                            }}
                          />
                        ),
                        className: "buy-sell-modal",
                        closeOnMaskClick: true
                      });

                      setValInput("");
                      onClose();
                    }
                  } catch (e: any) {
                    console.log(e);
                    setIsLoading(false);

                    if (e.message) {
                      fail(e.message);
                    } else {
                      fail("Transtion fail");
                    }
                  }
                }}
                style={{
                  color: "#000",
                  background: activeIndex === 0 ? "#C9FF5D" : "#FFC9F1",
                  height: from === "panel" ? 36 : 60,
                  width: from === "panel" ? "120px" : "100%"
                }}
              >
                {activeIndex === 0 ? "Buy" : "Sell"}
              </MainBtn>
            </div>
          </div>
        </div>
      </div>

      <SlipPage
        show={showSlip}
        slipData={slip}
        token={token}
        textRef={slippageTextRef}
        onSlipDataChange={(val: any) => {
          setSlip({
            slip: val
          });
        }}
        onHide={() => {
          setShowSlip(false);
        }}
      />
    </>
  );
}
