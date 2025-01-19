import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import { BN } from "@coral-xyz/anchor";
import Big from "big.js";
import styles from "../trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { getFullNum, getPointByVolume, getTransaction } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import SlipPage from "../slippage";
import TradeSuccessModal from "@/app/components/tradeSuccessModal";
import { Modal } from "antd-mobile";
import Tabs from "@/app/sections/home/laptop/panels/trade/tabs";
import type { Project } from "@/app/type";
import { useUser } from "@/app/store/useUser";
import useJupiter from "@/app/hooks/useJupiter";
import { useUserAgent } from "@/app/context/user-agent";
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

const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.0001, 0.0005, 0.001];

export default function BuySellLaunched({
  token,
  initType,
  onClose,
  show,
  from
}: Props) {
  const { tokenName, tokenSymbol, tokenDecimals } = token;
  const [showSlip, setShowSlip] = useState(false);
  const { slip, set: setSlip }: any = useSlip();
  const { isMobile } = useUserAgent();

  const tokenUri = token.tokenIcon || token.tokenImg;

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

  const [solPercent, setSolPercent] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(1);

  const [valInput, setValInput] = useState("");

  const [buyIn, setBuyIn] = useState("0");
  const [buyInSol, setBuyInSol] = useState("0");

  const [sellOut, setSellOut] = useState("0");
  const [sellOutSol, setSellOutSol] = useState("0");
  const [reFreshBalnace, setReFreshBalnace] = useState(1);

  const { userInfo }: any = useUser();
  const { connection } = useConnection();

  const { solBalance, tokenBalance } = useBalance({
    mint: token.address as string,
    tokenDecimals: token.tokenDecimals as number,
    reFreshBalnace: reFreshBalnace
  });

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

  const { trade, getQoute, qoute } = useJupiter({
    tokenAddress: token.address
  });

  const TOKEN_PERCENT_LIST = useMemo(() => {
    return [25, 50, 75, 100];
  }, []);

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
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

          const buyIn = new Big(debounceVal)
            .mul(10 ** SOL.tokenDecimals)
            .toFixed(0);

          getQoute(buyIn, "buy", slip * 100)
            .then((res: any) => {
              if (res.quoteResponse) {
                setBuyIn(
                  new Big(res.quoteResponse?.otherAmountThreshold)
                    .div(10 ** desToken.tokenDecimals)
                    .toFixed(desToken.tokenDecimals)
                );
                setBuyInSol(buyIn);

                if (Number(debounceVal) > Number(solBalance)) {
                  setIsError(true);
                  setErrorMsg("Invalid balance");
                  return;
                }

                setIsError(false);
              } else {
                setIsError(true);
              }
              setIsLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setIsError(true);
              setIsLoading(false);
            });
        } else if (tokenType === 0) {
          if (Number(debounceVal) <= 0) {
            setIsError(true);

            setErrorMsg("Invalid value");
            return;
          }

          if (Number(debounceVal) > Number(tokenBalance)) {
            setIsError(true);
            setErrorMsg("Invalid balance");
            return;
          }

          const buyIn = new Big(debounceVal).mul(10 ** desToken.tokenDecimals);
          const buyInSol = buyIn.div(qoute).toFixed(SOL.tokenDecimals);
          if (buyInSol) {
            setBuyIn(debounceVal);
            setBuyInSol(buyInSol);
            setIsError(false);
            setIsLoading(false);
          } else {
            setIsError(true);
          }
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

          getQoute(sellOut, "sell", slip * 100)
            .then((res: any) => {
              if (res.quoteResponse) {
                setSellOutSol(
                  new Big(res.quoteResponse?.otherAmountThreshold)
                    .div(10 ** SOL.tokenDecimals)
                    .toFixed(SOL.tokenDecimals)
                );
                setSellOut(sellOut);
                setIsError(false);
              } else {
                setIsError(true);
              }
              setIsLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setIsError(true);
              setIsLoading(false);
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
  }, [debounceVal, tokenType, slip, currentToken]);

  return (
    <>
      <div
        className={[
          styles.cationArea,
          !isMobile ? styles.LaptopMain : styles.panel
        ].join(" ")}
      >
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
                setValInput("");
              }}
              className={[
                styles.tab,
                activeIndex === 1 ? styles.active : null
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
            style={{
              // width: from === "panel" ? 335 : "100%"
            }}
          >
            <div className={styles.actionArea}>
              {/* {activeIndex === 0 ? (
              <div
                className={`${styles.switchToken} button`}
                onClick={() => {
                  if (tokenType === 0) {
                    setCurrentToken(SOL);
                    setTokenType(1);
                  } else {
                    setCurrentToken(desToken);
                    setTokenType(0);
                  }
                  setValInput("");
                }}
              >
                <span className={styles.switchTitle}>switch to </span>
                <span className={styles.switchTokenName}>
                  {tokenType === 0 ? SOL.tokenName : tokenName}
                </span>
              </div>
            ) : (
              <div></div>
            )} */}

              <div></div>

              <div
                onClick={() => {
                  setShowSlip(true);
                }}
                className={`${styles.slippage} button`}
              >
                Set max slippage
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
                  className={styles.input}
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
                  <div>Maximum Payment</div>
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

          <div className={from === "panel" ? styles.receiveAmountWrapper : styles.receiveAmountWrapperMobile}>
            {activeIndex === 0 && tokenType === 1 && (
              <div className={styles.receiveTokenAmount}>
                <div className={styles.receiveTitle}>Minimum Received</div>
                <div className={styles.receiveAmount}>
                  {buyIn && buyIn} {tokenName}
                </div>
              </div>
            )}

            {activeIndex === 0 && tokenType === 0 && (
              <div className={styles.paid}>
                <div>Maximum Payment</div>
                <div>{buyInSol && buyInSol} SOL</div>
              </div>
            )}

            {activeIndex === 1 && (
              <div className={styles.receiveTokenAmount}>
                <div className={styles.receiveTitle}>Minimum Received</div>
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
                  try {
                    if (isLoading || isError) {
                      return;
                    }

                    let hash;
                    let showBuyInToken = buyIn;
                    setIsLoading(true);
                    if (activeIndex === 0) {
                      hash = await trade(buyInSol, "buy", slip * 100);
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
                    } else if (activeIndex === 1) {
                      hash = await trade(sellOut, "sell", slip * 100);
                    }
                    setIsLoading(false);

                    if (hash) {
                      const volume =
                        activeIndex === 0
                          ? new Big(buyInSol)
                              .div(10 ** SOL.tokenDecimals)
                              .toFixed(SOL.tokenDecimals)
                          : sellOutSol;

                      const pointByVolume = await getPointByVolume(
                        Big(volume).toString(),
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

                      setValInput("");
                      onClose();
                    }
                  } catch (e) {
                    console.log(e);
                    setIsLoading(false);
                    fail("Transtion fail");
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
