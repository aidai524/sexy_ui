import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "ahooks";
import { BN } from "@coral-xyz/anchor";
import Big from "big.js";
import styles from "../trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { getFullNum } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import SlipPage from "../slippage/slippage";
import TradeSuccessModal from "@/app/components/tradeSuccessModal";
import { Modal } from "antd-mobile";
import type { Project } from "@/app/type";
import { useUser } from "@/app/store/useUser";
import useJupiter from "@/app/hooks/useJupiter";

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
  onClose: () => void;
}

const SOL: Token = {
  tokenName: "SOL",
  tokenSymbol: "SOL",
  tokenUri: "/img/home/solana.png",
  tokenDecimals: 9
};

const SOL_PERCENT_LIST = [0.0001, 0.0005, 0.001];

export default function BuySellLaunched({ token, initType, from, onClose }: Props) {
  const { tokenName, tokenSymbol, tokenDecimals } = token;
  const [showSlip, setShowSlip] = useState(false);
  const [slip, setSlip] = useState(3);

  const tokenUri = token.tokenIcon || token.tokenImg

  const desToken: Token = {
    tokenName,
    tokenSymbol: tokenSymbol as string,
    tokenUri,
    tokenDecimals: tokenDecimals as number
  };



  const [activeIndex, setActiveIndex] = useState(initType === "buy" ? 0 : 1);
  const [tokenType, setTokenType] = useState<number>(0);
  const [currentToken, setCurrentToken] = useState<Token>(desToken);
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

  const { userInfo }: any = useUser()

  const tokenBalance = 0
  const solBalance = 0

  useEffect(() => {
    if (initType === 'buy') {
      setActiveIndex(0)
    } else {
      setActiveIndex(1)
    }
  }, [initType])

  const { trade } = useJupiter({
    tokenAddress: '4MvdsczbZ7PpZPdjcw793sRqGeH9RsxqtrQvxniLpump'
  })

  const TOKEN_PERCENT_LIST = useMemo(() => {
    return [25, 50, 75, 100];
  }, []);

  const debounceVal = useDebounce(valInput, { wait: 800 });

  useEffect(() => {
    if (debounceVal) {
      setIsError(false);
      return

      setIsError(false);
      setIsLoading(true)
      if (activeIndex === 0) {
        let buyInSol = "";
        if (tokenType === 1) {
          if (Number(debounceVal) <= 0) {
            setIsError(true);
            setErrorMsg("Invalid value");
            setIsLoading(false)
            return
          }

         
        } else if (tokenType === 0) {
          if (Number(debounceVal) <= 0) {
            setIsError(true);
            
            setErrorMsg("Invalid value");
            return
          }


         
        }
      } else if (activeIndex === 1) {
        let sellOut = ''
        let sellSolOut = ''
        if (tokenType === 1) {
         
        } 
        else if (tokenType === 0) {
          if (Number(debounceVal) <= 0) {
            setIsError(true);
            setIsLoading(false)
            setErrorMsg("Invalid value");
            return
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
  }, [debounceVal, tokenType, slip, currentToken]);

  console.log()

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

        <div className={styles.inputArea}>
          <div className={styles.actionArea}>
            {activeIndex === 0 ? (
              <div
                className={styles.switchToken}
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
                ? tokenBalance
                : solBalance}
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
              {buyIn ? new Big(buyIn).div(10 ** token.tokenDecimals!).toFixed(token.tokenDecimals) : ''} {tokenName}
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div style={{ marginTop: 30 }} className={styles.receiveTokenAmount}>
            <div className={styles.receiveTitle}>You will get</div>
            <div className={styles.receiveAmount}>{(sellOutSol && Number(sellOutSol) > 0) ? new Big(sellOutSol).div(10 ** SOL.tokenDecimals).toFixed(SOL.tokenDecimals) : 0} SOL</div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <MainBtn
            isLoading={isLoading}
            isDisabled={isError}
            onClick={async () => {
              trade()

              try {
                if (isLoading || isError) {
                  return;
                }

                let hash
                if (activeIndex === 0) {
                  setIsLoading(true);
                } else if (activeIndex === 1) {
                  setIsLoading(true);
                }
                setIsLoading(false);


                if (hash) {
                  const modalHandler = Modal.show({
                    content: <TradeSuccessModal
                      type={activeIndex}
                      userInfo={userInfo}
                      token={token}
                      solAmount={activeIndex === 0 ? buyInSol : sellOutSol}
                      amount={ new Big(activeIndex === 0 ? buyIn : sellOut).div(10 ** token.tokenDecimals!).toFixed(2) }
                      onClose={() => {
                        modalHandler.close()
                      }} />,
                    className: 'buy-sell-modal',
                    closeOnMaskClick: true,
                  })
  
                  setValInput('')
                  onClose()
                }
                
              } catch (e) {
                console.log(e)
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
          console.log(val)
          setSlip(val);
        }}
        onHide={() => {
          setShowSlip(false);
        }}
      />


    </div>
  );
}
