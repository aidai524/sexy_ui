import type { ImageUploadItem } from "antd-mobile";
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

import type { Project } from "@/app/type";
import CreateSuccessModal from "./components/createSuccessModal";
import { useUser } from "@/app/store/useUser";
interface Props {
  onAddDataFill: (value: Project) => void;
  show: boolean;
}

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
    if (!tokenName) {
      inValidVals["tokenName"] = true;
      isValid = true;
    }

    if (!ticker) {
      inValidVals["ticker"] = true;
      isValid = true;
    }

    if (tokenImg.length === 0) {
      inValidVals["tokenImg"] = true;
      isValid = true;
    } else {
      const tokenImgObj = tokenImg[0];
      if (videoReg.test(tokenImgObj.url)) {
        if (tokenIcon.length === 0) {
          inValidVals["tokenIcon"] = true;
          isValid = true;
        }
      }
    }

    if (!about) {
      inValidVals["about"] = true;
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
  }, [tokenName, ticker, tokenImg, about]);

  useImperativeHandle(
    ref,
    () => ({
      onPreview
    }),
    [tokenName, ticker, tokenImg, about]
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
              className={`${styles.inputText} ${
                inValidVals["tokenName"] ? styles.inputError : ""
              } ${!isMobile && styles.laptopInputText}`}
              placeholder="Meme name"
            />
          </div>
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
              className={`${styles.inputText} ${
                inValidVals["ticker"] ? styles.inputError : ""
              } ${!isMobile && styles.laptopInputText}`}
              placeholder="say something"
            />
          </div>
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
            type="token"
            accept="image/*, video/mp4"
            fileList={tokenImg}
            setFileList={setTokenImg}
          />
          <div className={styles.uploadTip}>Support img/png/gif/mp4</div>
        </div>
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
        {showTokenSymbol && (
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
            className={`${styles.inputText} ${
              inValidVals["about"] ? styles.inputError : ""
            } ${!isMobile && styles.laptopInputText}`}
            placeholder="say something"
          />
        </div>
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
        <div className={styles.groupContent}>
          <Link
            value={twitter}
            onChange={(val) => {
              setTwitter(val);
            }}
            type="X"
            img="/img/community/x.svg"
          />
        </div>

        <div className={styles.groupContent}>
          <Link
            value={telegram}
            onChange={(val) => {
              setTelegram(val);
            }}
            type="Telegram"
            img="/img/community/telegram.svg"
          />
        </div>

        <div className={styles.groupContent}>
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

      {isMobile && (
        <div className={styles.btnWapper}>
          <MainBtn onClick={onPreview}>Preview</MainBtn>
        </div>
      )}
      {/* <CreateSuccessModal show={true} onHide={() => {}}/> */}
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
