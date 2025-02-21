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
import useBalance from "@/app/hooks/useBalance";
import useSolPrice from "@/app/hooks/use-sol-price";
import { numberFormatter } from "@/app/utils/common";
import CreateSuccessModal from "../createSuccessModal";

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

const SOL_PERCENT_LIST = [0.01, 0.05, 35, 'MAX'];

export default function Create({
  token,
  data,
  onCreateTokenSuccess,
  onBeforeCreate,
  width,
  getSubmitFn,
  setShowSuccessModal
}: any) {
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
  const [modalShow, setModalShow] = useState(false)
  const [currentToken, setCurrentToken] = useState<Token>(SOL);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [solPercent, setSolPercent] = useState<any>(0);
  const [valInput, setValInput] = useState("");
  const [launchChecked, setLaunchChecked] = useState(false);

  const { solPrice } = useSolPrice();

  const { createToken, tokenInfo } = useTokenTrade({
    tokenName,
    tokenSymbol,
    tokenDecimals: 6,
    loadData: false
  });

  const { solBalance } = useBalance({
    reFreshBalnace: 10,
    tokenDecimals: 0,
    mint: ''
  });

  const validateSameName = useCallback(async () => {
    const tokenInUse = await httpGet(
      `/project?token_name=${tokenName}&token_symbol=${tokenSymbol.toUpperCase()}`
    );

    if (tokenInUse.code === 0 && tokenInUse.data?.length > 0) {
      return "Token name already in use";
    }

    return "";
  }, [tokenName, tokenSymbol]);

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
      if (Number(debounceVal) > 0 && Number(debounceVal) <= Number(solBalance)) {
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  }, [debounceVal]);

  const submit = async (ignorePrepaid: number) => {
    // setModalShow(true);
    // return;

    try {
      if (isLoading || isError) {
        return;
      }

      setIsLoading(true);

      const sameNameRes = await validateSameName();

      if (sameNameRes) {
        setIsLoading(false);
        fail(sameNameRes);
      }

      await onBeforeCreate()

      const hash = await createToken({
        name: tokenName,
        symbol: tokenSymbol,
        uri: tokenUri,
        launching: launchChecked,
        amount: (ignorePrepaid !== 0 && valInput)
          ? new Big(valInput).mul(10 ** 9).toString()
          : ""
      });

      if (!hash) {
        throw "Create token error";
      }

      const isSuccess = await onCreateTokenSuccess();
      if (isSuccess) {
        setModalShow(true);
      }

      setIsLoading(false);
      // success('Transtion success')
    } catch (e: any) {
      console.log(e);
      setIsLoading(false);
      fail("Create token error");
    }
  }

  useEffect(() => {
    if (getSubmitFn) {
      getSubmitFn(submit)
    }
  }, [])

  return (
    <>
      <div
        className={styles.Container}
        style={{
          height: 'calc(100vh - 270px)'
        }}
      >
        <div className={styles.quickAction}>
          <div className={styles.walletBalance}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9332 8.2551H12.7999C12.2341 8.2551 11.6915 8.48824 11.2914 8.90322C10.8913 9.31821 10.6666 9.88105 10.6666 10.4679C10.6666 11.0548 10.8913 11.6176 11.2914 12.0326C11.6915 12.4476 12.2341 12.6808 12.7999 12.6808H14.9332V14.8936C14.9332 15.187 14.8208 15.4684 14.6208 15.6759C14.4207 15.8834 14.1494 16 13.8665 16H1.06666C0.783761 16 0.512453 15.8834 0.312416 15.6759C0.11238 15.4684 0 15.187 0 14.8936V6.04227C0 5.89697 0.0275901 5.7531 0.0811946 5.61886C0.134799 5.48463 0.213368 5.36266 0.312416 5.25992C0.411464 5.15718 0.529052 5.07568 0.658465 5.02008C0.787877 4.96447 0.926581 4.93586 1.06666 4.93586H13.8665C14.0066 4.93586 14.1453 4.96447 14.2747 5.02008C14.4041 5.07568 14.5217 5.15718 14.6208 5.25992C14.7198 5.36266 14.7984 5.48463 14.852 5.61886C14.9056 5.7531 14.9332 5.89697 14.9332 6.04227V8.2551ZM11.1999 1.10656V3.82944H1.59998L9.70017 0.0952926C9.86258 0.0204512 10.0404 -0.0111135 10.2176 0.00346643C10.3948 0.0180464 10.5656 0.0783089 10.7146 0.178779C10.8636 0.279249 10.986 0.416742 11.0708 0.578768C11.1555 0.740794 11.1999 0.922217 11.1999 1.10656ZM12.7999 9.36151H14.9332C15.0733 9.36149 15.212 9.39009 15.3414 9.44568C15.4709 9.50128 15.5885 9.58277 15.6875 9.68551C15.7866 9.78826 15.8652 9.91023 15.9188 10.0445C15.9724 10.1787 16 10.3226 16 10.4679C16 10.6132 15.9724 10.7571 15.9188 10.8914C15.8652 11.0256 15.7866 11.1476 15.6875 11.2503C15.5885 11.3531 15.4709 11.4346 15.3414 11.4902C15.212 11.5458 15.0733 11.5744 14.9332 11.5743H12.7999C12.6598 11.5744 12.5211 11.5458 12.3916 11.4902C12.2622 11.4346 12.1446 11.3531 12.0455 11.2503C11.9465 11.1476 11.8679 11.0256 11.8143 10.8914C11.7606 10.7571 11.7331 10.6132 11.7331 10.4679C11.7331 10.3226 11.7606 10.1787 11.8143 10.0445C11.8679 9.91023 11.9465 9.78826 12.0455 9.68551C12.1446 9.58277 12.2622 9.50128 12.3916 9.44568C12.5211 9.39009 12.6598 9.36149 12.7999 9.36151Z" fill="#9290B1" />
            </svg>
            <span>{numberFormatter(solBalance, 2, true)} SOL</span>
          </div>

          <div className={styles.tokenPercent}>
            {SOL_PERCENT_LIST.map((item) => {
              return (
                <div
                  onClick={() => {
                    if (item === 'MAX') {
                      setSolPercent(item);
                      setValInput(solBalance);
                    } else {
                      setSolPercent(item);
                      setValInput(getFullNum(item));
                    }
                  }}
                  key={item}
                  className={[
                    "button",
                    styles.percentTag,
                    item === solPercent ? styles.tagActive : ""
                  ].join(" ")}
                >
                  {getFullNum(item)}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.inputArea}>
          <input
            placeholder="0"
            value={valInput}
            onChange={(e) => {
              setValInput(e.target.value);
              setSolPercent(0);
            }}
            className={styles.input}
          />
          <div className={styles.inputToken}>SOL</div>
          <div className={styles.inputPrice}>$0.00</div>
        </div>


        <div className={[styles.cationArea, styles.panel].join(" ")}>
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
        </div>
      </div>

      <CreateSuccessModal onShare={setShowSuccessModal} show={modalShow} onHide={() => {
        setModalShow(false);
      }} token={token} />
    </>
  );
}
