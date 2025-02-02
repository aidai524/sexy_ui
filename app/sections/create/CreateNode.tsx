import { Button, type ImageUploadItem } from "antd-mobile";
import styles from "./create.module.css";
import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback
} from "react";
import Upload, { videoReg } from "@/app/components/upload";
import Link from "./components/link";
import MainBtn from "@/app/components/mainBtn";
import CheckBox from "@/app/components/checkBox";
import { useUserAgent } from "@/app/context/user-agent";
import ErrMsg from "./components/errMsg";
import type { Project } from "@/app/type";
import { httpGet, isValidURL } from "@/app/utils";

interface Props {
  onAddDataFill: (value: Project) => void;
  show: boolean;
}

const name_reg = /^[a-zA-Z0-9]{1,10}$/;

export default forwardRef(function CreateNode(
  { onAddDataFill, show }: Props,
  ref: any
) {
  const [tokenImg, setTokenImg] = useState<ImageUploadItem[]>([]);
  const [tokenIcon, setTokenIcon] = useState<ImageUploadItem[]>([]);
  const [showTokenSymbol, setShowTokenSymbol] = useState<boolean>(false);
  const { isMobile } = useUserAgent();
  const [tokenName, setTokenName] = useState("");
  const [ticker, setTicker] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [x, setTwitter] = useState("");
  const [tg, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");

  const [canValid, setCanValid] = useState(false);
  const [inValidVals, setInvaldVasl] = useState<any>({});

  const validateSameName = useCallback(async () => {
    const tokenInUse = await httpGet(
      `/project?token_name=${tokenName}&token_symbol=${ticker.toUpperCase()}`
    );

    if (tokenInUse.code === 0 && tokenInUse.data?.length > 0) {
      return "Token name already in use";
    }

    return '';
  }, [tokenName, ticker])

  const validateName = useCallback((tokenName: string) => {
    if (!tokenName) {
      return "Token name cannot be empty";
    }

    if (tokenName.length > 50) {
      return "Token name cannot exceed 50";
    }

    return "";
  }, [ticker]);

  const validateTicker = useCallback((ticker: string) => {
    if (!ticker) {
      return "Ticker cannot be empty";
    }

    if (!name_reg.test(ticker)) {
      return "Only uppercase and lowercase letters and numbers are supported and the length is less than 10";
    }


    return "";
  }, [tokenName]);

  const validateImages = useCallback((tokenImg: ImageUploadItem[], tokenIcon: ImageUploadItem[], showTokenSymbol: boolean) => {
    if (tokenImg.length === 0) {
      return "Token image cannot be empty";
    }

    const tokenImgObj = tokenImg[0];
    if ((videoReg.test(tokenImgObj.url) || showTokenSymbol) && tokenIcon.length === 0) {
      return "Token icon cannot be empty";
    }

    return "";
  }, []);

  const validateAbout = useCallback((about: string) => {
    if (!about) {
      return "About icon cannot be empty";
    }

    if (about.length > 1000) {
      return "About cannot be length than 1000";
    }

    return "";
  }, []);

  const validateWebsite = useCallback((website: string) => {
    if (website && !isValidURL(website)) {
      return "Website is not a valid url";
    }
    return "";
  }, []);

  const validateTelegram = useCallback((tg: string) => {
    if (tg && !isValidURL(tg)) {
      return "Tg is not a valid url";
    }
    return "";
  }, []);

  const validateTwitter = useCallback((x: string) => {
    if (x && !isValidURL(x)) {
      return "Twitter is not a valid url";
    }
    return "";
  }, []);

  const validateDiscord = useCallback((discord: string) => {
    if (discord && !isValidURL(discord)) {
      return "Discord is not a valid url";
    }
    return "";
  }, []);

  const onPreview = useCallback(async () => {
    const inValidVals: any = {};
    let isValid = false;

    const nameError = await validateName(tokenName);
    if (nameError) {
      inValidVals["tokenName"] = nameError;
      isValid = true;
    }

    const tickerError = validateTicker(ticker);
    if (tickerError) {
      inValidVals["ticker"] = tickerError;
      isValid = true;
    }

    const imagesError = validateImages(tokenImg, tokenIcon, showTokenSymbol);
    if (imagesError) {
      inValidVals[imagesError.includes("icon") ? "tokenIcon" : "tokenImg"] = imagesError;
      isValid = true;
    }

    const aboutError = validateAbout(about);
    if (aboutError) {
      inValidVals["about"] = aboutError;
      isValid = true;
    }

    const websiteError = validateWebsite(website);
    if (websiteError) {
      inValidVals["website"] = websiteError;
      isValid = true;
    }

    const tgError = validateTelegram(tg);
    if (tgError) {
      inValidVals["tg"] = tgError;
      isValid = true;
    }

    const xError = validateTwitter(x);
    if (xError) {
      inValidVals["x"] = xError;
      isValid = true;
    }

    const discordError = validateDiscord(discord);
    if (discordError) {
      inValidVals["discord"] = discordError;
      isValid = true;
    }

    setInvaldVasl(inValidVals);

    if (isValid) {
      window.scrollTo({
        top: 0
      });
      return;
    }

    onAddDataFill({
      tokenName,
      ticker,
      about,
      tokenImg: tokenImg[0].url,
      tokenSymbol: ticker.toUpperCase(),
      tokenIcon: tokenIcon.length > 0 ? tokenIcon[0].url : tokenImg[0].url,
      website,
      x,
      tg,
      discord,
      status: 0
    });
  }, [
    tokenName,
    ticker,
    tokenImg,
    about,
    tokenIcon,
    website,
    x,
    tg,
    discord,
    showTokenSymbol,
    validateName,
    validateTicker,
    validateImages,
    validateAbout,
    validateWebsite,
    validateTelegram,
    validateTwitter,
    validateDiscord
  ]);

  useImperativeHandle(
    ref,
    () => ({
      onPreview
    }),
    [tokenName, ticker, tokenImg, about, tokenIcon, website, x, tg, discord]
  );

  useEffect(() => {
    if (tokenImg && tokenImg.length > 0) {
      const url = tokenImg[0].url;
      if (videoReg.test(url) || /.gif$/.test(url)) {
        setShowTokenSymbol(true);
      }
    }
  }, [tokenImg]);

  return (
    <div
      style={{
        display: show ? "block" : "none",
        paddingBottom: isMobile ? 100 : 20
      }}
    >
      <div
        className={styles.group}
        style={{
          width: isMobile ? "100%" : "calc(50% - 10px)"
        }}
      >
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          <span className={styles.require}>* </span>
          Name
        </div>
        <div className={styles.groupContent}>
          <input
            value={tokenName}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
            onBlur={async () => {
              let nameError = validateName(tokenName);
              if (!nameError) {
                nameError = await validateSameName()
              }
              if (nameError) {
                setInvaldVasl({ ...inValidVals, tokenName: nameError });
              } else {
                
                setInvaldVasl({ ...inValidVals, tokenName: "" });
              } 
            }}
            className={`${
              isMobile ? styles.inputText : styles.laptopInputText
            } ${inValidVals["tokenName"] ? styles.inputError : ""}`}
            placeholder="Meme name"
          />
        </div>
        {inValidVals["tokenName"] && (
          <ErrMsg>{inValidVals["tokenName"]}</ErrMsg>
        )}
      </div>

      <div
        className={styles.group}
        style={{
          width: isMobile ? "100%" : "calc(50% - 10px)"
        }}
      >
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          <span className={styles.require}>* </span>Ticker
        </div>
        <div className={styles.groupContent}>
          <input
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
            }}
            onBlur={async () => {
              let tickerError = validateTicker(ticker);
              // if (!tickerError) {
              //   tickerError = await validateSameName()
              // }
              if (tickerError) {
                setInvaldVasl({ ...inValidVals, ticker: tickerError });
              } else {
                setInvaldVasl({ ...inValidVals, ticker: "" });
              }
            }}
            className={`${
              isMobile ? styles.inputText : styles.laptopInputText
            } ${inValidVals["ticker"] ? styles.inputError : ""}`}
            placeholder="say something"
          />
        </div>
        {inValidVals["ticker"] && <ErrMsg>{inValidVals["ticker"]}</ErrMsg>}
      </div>

      <div className={styles.group}>
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          <span className={styles.require}>* </span>Image or Video
        </div>
        <div
          className={
            styles.groupContent +
            " " +
            styles.uploadContent +
            " " +
            (inValidVals["tokenImg"] ? styles.uploadError : "")
          }
        >
          <Upload
            percent={1}
            type="token"
            accept="image/*, video/mp4"
            fileList={tokenImg}
            setFileList={setTokenImg}
          />
          <div className={styles.uploadTip}>Support img/png/gif/mp4</div>
        </div>
        {inValidVals["tokenImg"] && <ErrMsg>{inValidVals["tokenImg"]}</ErrMsg>}
        <div className={styles.tokenSymbol}>
          <CheckBox
            checked={showTokenSymbol}
            onCheckChange={(isChecked) => {
              if (tokenImg && tokenImg.length > 0) {
                const url = tokenImg[0].url;
                if (videoReg.test(url)) {
                  setShowTokenSymbol(true);
                  return
                }
              }
              setShowTokenSymbol(isChecked);
            }}
          />
          <div className={styles.tokenSymbolTitle}>
            Another image for token symbol
          </div>
        </div>
        {showTokenSymbol && (
          <>
            <div
              className={
                styles.groupContent +
                " " +
                styles.uploadContent +
                " " +
                styles.avatar +
                " " +
                (inValidVals["tokenIcon"] ? styles.uploadError : "")
              }
              style={{ paddingLeft: 15, paddingTop: 10 }}
            >
              <Upload
                percent={1}
                type="avatar"
                accept="image/png, image/jpg, image/jpeg, image/svg"
                fileList={tokenIcon}
                setFileList={setTokenIcon}
              />
              <div className={styles.uploadTip}>Support img/png/svg</div>
            </div>
            {inValidVals["tokenIcon"] && (
              <ErrMsg>{inValidVals["tokenIcon"]}</ErrMsg>
            )}
          </>
        )}
      </div>

      <div className={styles.group}>
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          <span className={styles.require}>* </span>About us
        </div>
        <div className={styles.groupContent}>
          <input
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            onBlur={() => {
              const aboutError = validateAbout(about);
              if (aboutError) {
                setInvaldVasl({ ...inValidVals, about: aboutError });
              } else {
                setInvaldVasl({ ...inValidVals, about: "" });
              }
            }}
            className={`${styles.inputText} ${
              inValidVals["about"] ? styles.inputError : ""
            } ${!isMobile && styles.laptopInputText}`}
            placeholder="say something"
          />
        </div>
        {inValidVals["about"] && <ErrMsg>{inValidVals["about"]}</ErrMsg>}
      </div>

      <div className={styles.group}>
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          Website
        </div>
        <div className={isMobile ? styles.Website : styles.LinkPc}>
          <Link
            value={website}
            onChange={(val) => {
              setWebsite(val);
            }}
            onBlur={() => {
              const websiteError = validateWebsite(website);
              if (websiteError) {
                setInvaldVasl({ ...inValidVals, website: websiteError });
              } else {
                setInvaldVasl({ ...inValidVals, website: "" });
              }
            }}
          />
        </div>
        {inValidVals["website"] && <ErrMsg>{inValidVals["website"]}</ErrMsg>}
      </div>

      <div className={styles.group}>
        <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
          Community
        </div>
        <div
          className={styles.Flex}
          style={{
            columnGap: isMobile ? 0 : 20
          }}
        >
          <div
            className={styles.groupContent}
            style={{
              width: "100%"
            }}
          >
            <Link
              value={x}
              onChange={(val) => {
                setTwitter(val);
              }}
              onBlur={() => {
                const xError = validateTwitter(x);
                if (xError) {
                  setInvaldVasl({ ...inValidVals, x: xError });
                } else {
                  setInvaldVasl({ ...inValidVals, x: "" });
                }
              }}
              type="X"
              img="/img/community/x.svg"
            />
            {inValidVals["x"] && <ErrMsg>{inValidVals["x"]}</ErrMsg>}
          </div>
          <div
            className={isMobile ? styles.groupContent : styles.LinkPc}
            style={{
              width: "100%"
            }}
          >
            <Link
              value={tg}
              onChange={(val) => {
                setTelegram(val);
              }}
              onBlur={() => {
                const tgError = validateTelegram(tg);
                if (tgError) {
                  setInvaldVasl({ ...inValidVals, tg: tgError });
                } else {
                  setInvaldVasl({ ...inValidVals, tg: "" });
                }
              }}  
              type="Telegram"
              img="/img/community/telegram.svg"
            />
            {inValidVals["tg"] && <ErrMsg>{inValidVals["tg"]}</ErrMsg>}
          </div>
          <div
            className={isMobile ? styles.groupContent : styles.LinkPc}
            style={{
              width: "100%"
            }}
          >
            <Link
              value={discord}
              onChange={(val) => {
                setDiscord(val);
              }}
              onBlur={() => {
                const discordError = validateDiscord(discord);
                if (discordError) {
                  setInvaldVasl({ ...inValidVals, discord: discordError });
                } else {
                  setInvaldVasl({ ...inValidVals, discord: "" });
                }
              }}
              type="Discord"
              img="/img/community/discard.svg"
            />
            {inValidVals["discord"] && (
              <ErrMsg>{inValidVals["discord"]}</ErrMsg>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <div className={styles.btnWapper}>
          <MainBtn onClick={onPreview}>Preview</MainBtn>
        </div>
      )}
    </div>
  );
});