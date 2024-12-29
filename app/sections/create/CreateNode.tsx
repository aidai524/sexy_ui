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
import { success, fail } from "@/app/utils/toast";
import ErrMsg from "./components/errMsg";
import type { Project } from "@/app/type";

interface Props {
  onAddDataFill: (value: Project) => void;
  show: boolean;
}

const name_reg = /^[a-zA-Z0-9]{1,16}$/

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
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");

  const [canValid, setCanValid] = useState(false);
  const [inValidVals, setInvaldVasl] = useState<any>({});

  const onPreview = useCallback(() => {
    let isValid = false;
    const inValidVals: any = {};
    if (!name_reg.test(tokenName)) {
      inValidVals["tokenName"] = 'Only uppercase and lowercase letters and numbers are supported and the length is less than 16';
      isValid = true;
    }

    if (!ticker) {
      inValidVals["ticker"] = 'Ticker cannot be empty';
      isValid = true;
    }

    if (tokenImg.length === 0) {
      inValidVals["tokenImg"] = 'Token image cannot be empty';
      isValid = true;
    } else {
      const tokenImgObj = tokenImg[0];
      if (videoReg.test(tokenImgObj.url) || showTokenSymbol) {
        if (tokenIcon.length === 0) {
          inValidVals["tokenIcon"] = 'Token icon cannot be empty';
          isValid = true;
        }
      }
    }

    if (!about) {
      inValidVals["about"] = 'About icon cannot be empty';
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
      tokenSymbol: tokenName.toUpperCase(),
      tokenIcon: tokenIcon.length > 0 ? tokenIcon[0].url : tokenImg[0].url,
      website,
      twitter,
      telegram,
      discord
    });
  }, [tokenName, ticker, tokenImg, about, tokenIcon, website, twitter, telegram, discord, showTokenSymbol]);

  useImperativeHandle(
    ref,
    () => ({
      onPreview
    }),
    [tokenName, ticker, tokenImg, about, tokenIcon, website, twitter, telegram, discord]
  );

  useEffect(() => {
    if (tokenImg && tokenImg.length > 0) {
      const url = tokenImg[0].url;
      if (videoReg.test(url)) {
        setShowTokenSymbol(true);
      }
    }
  }, [tokenImg]);

  return (
    <div
      className={styles.create}
      style={{
        display: show ? "block" : "none",
        paddingBottom: isMobile ? 100 : 20
      }}
    >
      <div
        className={styles.Flex}
        style={{
          gap: isMobile ? 0 : 20
        }}
      >
        <div
          className={styles.group}
          style={{
            width: isMobile ? "100%" : "calc(50% - 10px)"
          }}
        >
          <div className={styles.groupTitle}>
            <span className={styles.require}>*</span>Name
          </div>
          <div className={styles.groupContent}>
            <input
              value={tokenName}
              onChange={(e) => {
                setTokenName(e.target.value);
              }}
              className={`${styles.inputText} ${inValidVals["tokenName"] ? styles.inputError : ""
                } ${!isMobile && styles.laptopInputText}`}
              placeholder="Meme name"
            />
          </div>
          {
            inValidVals["tokenName"] && <ErrMsg>{ inValidVals["tokenName"] }</ErrMsg>
          }
        </div>

        <div
          className={styles.group}
          style={{
            width: isMobile ? "100%" : "calc(50% - 10px)"
          }}
        >
          <div className={styles.groupTitle}>
            <span className={styles.require}>*</span>Ticker
          </div>
          <div className={styles.groupContent}>
            <input
              value={ticker}
              onChange={(e) => {
                setTicker(e.target.value);
              }}
              className={`${styles.inputText} ${inValidVals["ticker"] ? styles.inputError : ""
                } ${!isMobile && styles.laptopInputText}`}
              placeholder="say something"
            />
          </div>
          {
            inValidVals["ticker"] && <ErrMsg>{ inValidVals["ticker"] }</ErrMsg>
          }
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Image or Video
        </div>
        <div
          className={
            styles.groupContent +
            " " +
            styles.uploadContent +
            " " +
            (inValidVals["tokenImg"] ? styles.uploadError : "")
          }
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
          <Upload
            percent={0}
            type="token"
            accept="image/*, video/mp4"
            fileList={tokenImg}
            setFileList={setTokenImg}
          />
          <div className={styles.uploadTip}>Support img/png/gif/mp4</div>
        </div>
        {
            inValidVals["tokenImg"] && <ErrMsg>{ inValidVals["tokenImg"] }</ErrMsg>
          }
        <div className={styles.tokenSymbol}>
          <CheckBox
            checked={showTokenSymbol}
            onCheckChange={(isChecked) => {
              setShowTokenSymbol(isChecked);
            }}
          />
          <div className={styles.tokenSymbolTitle}>
            Another image for token symbol
          </div>
        </div>
        {showTokenSymbol && (<>
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
              type="token"
              fileList={tokenIcon}
              setFileList={setTokenIcon}
            />
            <div className={styles.uploadTip}>Support img/png/svg</div>
          </div>
          {
            inValidVals["tokenIcon"] && <ErrMsg>{ inValidVals["tokenIcon"] }</ErrMsg>
          }
          </>
        )}
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>About us
        </div>
        <div className={styles.groupContent}>
          <input
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            className={`${styles.inputText} ${inValidVals["about"] ? styles.inputError : ""
              } ${!isMobile && styles.laptopInputText}`}
            placeholder="say something"
          />
        </div>
        {
            inValidVals["about"] && <ErrMsg>{ inValidVals["about"] }</ErrMsg>
          }
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>Website</div>
        <div
          className={styles.groupContent}
          style={{
            paddingTop: 10,
            background: isMobile ? "rgba(18, 23, 25, 1)" : "transparent"
          }}
        >
          <Link
            value={website}
            onChange={(val) => {
              setWebsite(val);
            }}
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>Community</div>
        <div
          className={styles.Flex}
          style={{
            columnGap: isMobile ? 0 : 20
          }}
        >
          <div
            className={styles.groupContent}
            style={{
              width: isMobile ? "100%" : "calc(50% - 10px)"
            }}
          >
            <Link
              value={twitter}
              onChange={(val) => {
                setTwitter(val);
              }}
              type="X"
              img="/img/community/x.svg"
            />
          </div>
          <div
            className={styles.groupContent}
            style={{
              width: isMobile ? "100%" : "calc(50% - 10px)"
            }}
          >
            <Link
              value={telegram}
              onChange={(val) => {
                setTelegram(val);
              }}
              type="Telegram"
              img="/img/community/telegram.svg"
            />
          </div>
          <div
            className={styles.groupContent}
            style={{
              width: isMobile ? "100%" : "calc(50% - 10px)"
            }}
          >
            <Link
              value={discord}
              onChange={(val) => {
                setDiscord(val);
              }}
              type="Discord"
              img="/img/community/discard.svg"
            />
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

// { tokenName, ticker, about, website, twitter, telegram, discord }:
function validateVal(params: any) {
  const isValid = Object.values(params).every((val) => !!val);

  if (params.tokenImg?.length === 0) {
    return false;
  }

  const tokenImg = params.tokenImg[0];
  if (videoReg.test(tokenImg.url)) {
    if (params.tokenIcon.length === 0) {
      return false;
    }
  }

  return isValid;
}
