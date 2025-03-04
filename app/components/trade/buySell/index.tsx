import { useRef, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import { BN } from "@coral-xyz/anchor";
import Big from "big.js";
import styles from "../trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { getFullNum, getPointByVolume, getTransaction, simplifyNum } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import SlipPage from "../slippage";
import TradeSuccessModal from "@/app/components/tradeSuccessModal";
import { Modal } from "antd-mobile";
import Tabs from "@/app/components/tabs";
import type { Project } from "@/app/type";
import { useUser } from "@/app/store/useUser";
import { useConnection } from "@solana/wallet-adapter-react";
import { useSlip } from "@/app/store/useSlip";
import { numberFormatter } from "@/app/utils/common";
import { useConfig } from "@/app/store/useConfig";
import { useUserAgent } from "@/app/context/user-agent";

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
  onSuccess?: () => void;
}

const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.1, 0.5, 1, "Max"];

export default function BuySell({
  from,
  token,
  initType,
  onClose,
  onSuccess,
  show
}: Props) {

  const { tokenName, tokenSymbol, tokenDecimals } = token;
  const [showSlip, setShowSlip] = useState(false);
  const { slip, set: setSlip }: any = useSlip();
  const slippageTextRef = useRef<any>();
  const { config }: any = useConfig();
  const { isMobile } = useUserAgent();
  const tokenUri =
    token.tokenIcon || token.tokenImg || "/img/token-icon-placeholder.svg";

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

  const [isLoading, setIsLoading] = useState(false);
  const [successMoalShow, setSuccessMoalShow] = useState(true);
  const [buyTokenType, setBuyTokenType] = useState(1);

  const [solPercent, setSolPercent] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(1);

  const [valInput, setValInput] = useState("");

  const [buyIn, setBuyIn] = useState("0");
  const [buyInSol, setBuyInSol] = useState("0");

  const [sellOut, setSellOut] = useState("0");
  const [sellOutSol, setSellOutSol] = useState("0");

  const [isMax, setIsMax] = useState(false);
  const { connection } = useConnection();

  const { userInfo }: any = useUser();

  useEffect(() => {
    if (initType === "buy") {
      setActiveIndex(0);
      setTokenType(1);
      setCurrentToken(SOL);
    } else {
      setTokenType(0);
      setCurrentToken(desToken);
      setActiveIndex(1);
    }
  }, [initType, show]);

  const {
    buyToken,
    buyTokenWithFixedOutput,
    sellToken,
    getRate,
    tokenBalance,
    solBalance,
    updateBalance
  } = useTokenTrade({
    tokenName,
    tokenSymbol: tokenSymbol as string,
    tokenDecimals: tokenDecimals as number
  });

  const TOKEN_PERCENT_LIST = useMemo(() => {
    return [25, 50, 75, 100];
  }, []);

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
    try {
      if (debounceVal && Number(debounceVal) > 0) {
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

            buyInSol = new Big(debounceVal)
              .mul(10 ** SOL.tokenDecimals)
              .toFixed(0);

            getRate({
              solAmount: buyInSol,
              type: 'buy'
            }).then((res: any) => {
              const { result, isMax } = res;
              setIsMax(isMax);
              const buyIn = new Big(result)
                .mul(1 - slip / 100)
                .toFixed(token.tokenDecimals);
              setBuyIn(buyIn);
              setIsLoading(false);

              if (
                Number(buyIn) >
                new Big(1).div(10 ** token.tokenDecimals!).toNumber()
              ) {
                setIsError(false);
                setErrorMsg("");
              } else {
                setIsError(true);
                setErrorMsg("Enter a amount");
              }

              if (Number(debounceVal) > Number(solBalance)) {
                setIsError(true);
                setErrorMsg("Invalid balance");
                return;
              }
            });

            setBuyInSol(buyInSol);
          } else if (tokenType === 0) {
            if (Number(debounceVal) <= 0) {
              setIsError(true);
              setErrorMsg("Invalid value");
              return;
            }

            getRate({
              tokenAmount: new Big(debounceVal)
                .mul(10 ** token.tokenDecimals!)
                .toFixed(0),
              type: 'buy'
            }).then((res: any) => {
              const { result, isMax, maxBuy } = res;
              setIsMax(isMax);
              setIsLoading(false);

              buyInSol = new Big(result).mul(1 + slip / 100).toFixed(0);

              if (
                new Big(buyInSol).div(10 ** SOL.tokenDecimals).gt(solBalance)
              ) {
                setBuyInSol(buyInSol);
                setIsError(true);
                setErrorMsg("Invalid balance");
                return;
              }

              if (Number(buyInSol) > 0.000000001) {
                if (isMax) {
                  setBuyIn(maxBuy);
                } else {
                  setBuyIn(
                  new Big(debounceVal)
                    .mul(10 ** token.tokenDecimals!)
                    .toFixed(0)
                  );
                }
                setBuyInSol(buyInSol);
              } else {
                setBuyInSol("");
                setBuyIn("");
              }

              if (buyInSol) {
                setIsError(false);
                setErrorMsg("Enter a amount");
              }
            });
          }
        } else if (activeIndex === 1) {
          let sellOut = "";
          let sellSolOut = "";
          if (tokenType === 1) {
            // sellOut = new Big(debounceVal)
            //   .mul(rate)
            //   .mul(10 ** token.tokenDecimals)
            //   .toFixed(0);
          } else if (tokenType === 0) {
            if (Number(debounceVal) <= 0) {
              setIsError(true);
              setIsLoading(false);
              setErrorMsg("Invalid value");
              return;
            }

            sellOut = new Big(debounceVal)
              .mul(10 ** token.tokenDecimals!)
              .toFixed(0);

            getRate({
              tokenAmount: new Big(debounceVal)
                .mul(10 ** token.tokenDecimals!)
                .toFixed(0),
              type: 'sell'
            }).then((res: any) => {
              const { result, isMax } = res;
              setIsMax(isMax);
              setIsLoading(false);
              sellSolOut = new Big(result).mul(1 - slip / 100).toFixed(0);

              if (Number(debounceVal) > Number(tokenBalance)) {
                setIsError(true);
                setErrorMsg("Invalid balance");
                setSellOutSol(getFullNum(sellSolOut));
                return;
              }

              if (Number(sellSolOut) > 0.000000001) {
                setSellOut(sellOut);
                setSellOutSol(getFullNum(sellSolOut));
                setIsError(false);
              } else {
                setIsError(true);
                setErrorMsg("Amount is too little");
                setSellOut("");
              }
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
      <div
        className={[
          styles.cationArea,
          from === "panel" ? styles.pcActionArea : styles.mobileActionArea
        ].join(" ")}
      >
        {from === "panel" ? (
          <div className={styles.pcTabs}>
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
                if (index === 1) {
                  setCurrentToken(desToken);
                  setTokenType(0);
                  setTokenPercent(0);
                }

                if (index === 0) {
                  setTokenType(buyTokenType);
                  setCurrentToken(buyTokenType === 1 ? SOL : desToken);
                  setSolPercent(0);
                }
              }}
            />
            <div
              className={styles.pcSlipIcon + " "}
              ref={slippageTextRef}
              onClick={(ev) => {
                ev.stopPropagation();
                ev.nativeEvent.stopImmediatePropagation();
                setShowSlip(true);
              }}
            >
              <img src="/img/trade/slip.svg" />
            </div>
          </div>
        ) : (
          <div className={styles.tradeTabs}>
            <div
              onClick={() => {
                setActiveIndex(0);
                setValInput("");
                setTokenType(buyTokenType);
                setCurrentToken(buyTokenType === 1 ? SOL : desToken);
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
          <div className={styles.inputActionArea}>
            <div className={styles.actionArea}>
              <div className={styles.balance}>
                <img src="/img/trade/balance.svg" />
                <div className={styles.balanceNum}>
                  {" "}
                  {tokenType === 0
                    ? simplifyNum(Number(tokenBalance), 2) + " " + tokenSymbol
                    : simplifyNum(Number(solBalance), 2) + " SOL"}
                </div>
              </div>

              {activeIndex === 0 ? (
                <div
                  className={`${styles.switchToken} button`}
                  onClick={() => {
                    if (tokenType === 0) {
                      setCurrentToken(SOL);
                      setTokenType(1);
                      if (activeIndex === 0) {
                        setBuyTokenType(1);
                      }
                    } else {
                      setCurrentToken(desToken);
                      setTokenType(0);
                      if (activeIndex === 0) {
                        setBuyTokenType(0);
                      }
                    }
                    setValInput("");
                    setSolPercent(0);
                  }}
                >
                  <div
                    className={
                      styles.switchTokenImg +
                      " " +
                      (tokenType === 1 ? styles.active : "")
                    }
                  >
                    <img src={SOL.tokenUri} />
                  </div>
                  <div
                    className={
                      styles.switchTokenImg +
                      " " +
                      (tokenType === 0 ? styles.active : "")
                    }
                  >
                    <img src={desToken.tokenUri} />
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {from === "panel" ? (
                <></>
              ) : (
                <div
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.nativeEvent.stopImmediatePropagation();
                    setShowSlip(true);
                  }}
                  className={`${styles.slippage}`}
                  ref={slippageTextRef}
                >
                  <img src="/img/trade/slip.svg" className={styles.slipIcon} />
                  <span className="button">Slippage</span>
                </div>
              )}
            </div>

            <div
              className={`${styles.tokenBalanceBox} ${from === "panel" && styles.PanelInput
                }`}
            >
              <div className={styles.inputArea}>
                <input
                  placeholder="0"
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
                  className={styles.input}
                />
                <div className={styles.inputToken}>
                  <div className={styles.tokenName}>
                    {currentToken.tokenSymbol}
                  </div>
                  <div className={styles.tokenImg}>
                    <img className={styles.tiImg} src={currentToken.tokenUri} />
                  </div>
                </div>
                <div className={styles.tokenPrice}>
                  ${numberFormatter(
                    currentToken.tokenName === "SOL" ? Number(config.SolPrice) * Number(valInput) : Number(token.price) * Number(valInput),
                    2,
                    true
                  )}
                </div>
              </div>
            </div>

            {activeIndex === 0 && tokenType === 1 && (
              <div className={styles.tokenPercent + ' ' + (from === "panel" ? styles.PanelPercent : styles.Percent)}>
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
                        if (item === "Max") {
                          setSolPercent(new Big(solBalance).minus(0.03).toNumber());
                          setValInput(getFullNum(new Big(solBalance).minus(0.03).toNumber()));
                        } else {
                          setSolPercent(item as number);
                          setValInput(getFullNum(item as number));
                        }
                      }}
                      key={item}
                      className={[
                        styles.percentTag,
                        item === solPercent ? styles.tagActive : "",
                        "button"
                      ].join(" ")}
                    >
                      {getFullNum(item)}
                    </div>
                  );
                })}
              </div>
            )}

            {activeIndex === 1 && (
              <div className={styles.tokenPercent + ' ' + (from === "panel" ? styles.PanelPercent : styles.Percent)}>
                <div
                  onClick={() => {
                    setTokenPercent(0);
                    setValInput("");
                  }}
                  className={`${styles.percentTag} button`}
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
                    ? numberFormatter(new Big(buyIn)
                      .div(1 - slip / 100)
                      .div(10 ** token.tokenDecimals!)
                      .toFixed(token.tokenDecimals), token.tokenDecimals as number, true)
                    : ""}{" "}
                  {
                    from === "panel" ? <div>{token.tokenSymbol}</div> : (
                      <div className={styles.receiveTokenImgBox}>
                        <img
                          src={desToken.tokenUri}
                          className={styles.receiveTokenImg}
                        />
                      </div>
                    )}
                </div>
              </div>
            )}

            {activeIndex === 0 && tokenType === 0 && (
              <div className={styles.paid}>
                <div>Payment</div>
                <div className={styles.receiveAmount}>
                  {buyInSol &&
                    numberFormatter(new Big(buyInSol)
                      .div(1 + slip / 100)
                      .div(10 ** SOL.tokenDecimals)
                      .toFixed(SOL.tokenDecimals), SOL.tokenDecimals as number, true)}{" "}
                  {
                    from === "panel" ? <div>{SOL.tokenSymbol}</div> : (
                      <div className={styles.receiveTokenImgBox}>
                        <img src={SOL.tokenUri} className={styles.receiveTokenImg} />
                      </div>
                    )
                  }
                </div>
              </div>
            )}

            {activeIndex === 1 && (
              <div className={styles.receiveTokenAmount}>
                <div className={styles.receiveTitle}>Received</div>
                <div className={styles.receiveAmount}>
                  {sellOutSol && Number(sellOutSol) > 0
                    ? numberFormatter(new Big(sellOutSol)
                      .div(1 - slip / 100)
                      .div(10 ** SOL.tokenDecimals)
                      .toFixed(SOL.tokenDecimals), SOL.tokenDecimals as number, true)
                    : 0}{" "}
                  {
                    from === "panel" ? <div>{SOL.tokenSymbol}</div> : (
                      <div className={styles.receiveTokenImgBox}>
                        <img src={SOL.tokenUri} className={styles.receiveTokenImg} />
                      </div>
                    )
                  }

                </div>
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

                    let showBuyInToken = buyIn;
                    let hash;
                    if (activeIndex === 0) {
                      setIsLoading(true);
                      if (tokenType === 1) {
                        hash = await buyToken(
                          new Big(buyIn).toFixed(0),
                          buyInSol
                        );
                        if (hash) {
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
                      } else {
                        hash = await buyTokenWithFixedOutput(
                          isMax ? new Big(buyIn).toFixed(0) : new Big(buyIn).toFixed(0),
                          buyInSol
                        );
                      }
                    } else if (activeIndex === 1) {
                      setIsLoading(true);
                      hash = await sellToken(sellOut, sellOutSol);
                    }
                    setIsLoading(false);
                    onSuccess?.();
                    if (hash) {
                      const volume = activeIndex === 0 ? buyInSol : sellOutSol;
                      const pointByVolume = await getPointByVolume(
                        Big(volume)
                          .div(10 ** SOL.tokenDecimals)
                          .toFixed(SOL.tokenDecimals),
                        "sexy"
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

                      updateBalance();
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
                  color: activeIndex === 0 ? "#000" : "#fff",
                  background: activeIndex === 0 ? "#C9FF5D" : "#FF559D",
                  height: from === "panel" ? 36 : 60,
                  width: "100%"
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
