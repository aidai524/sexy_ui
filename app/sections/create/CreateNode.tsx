import type { ImageUploadItem } from "antd-mobile";
import styles from "./create.module.css";
import { useEffect, useState } from "react";
import Upload, { videoReg } from "@/app/components/upload";
import Link from "./components/link";
import MainBtn from "@/app/components/mainBtn";
import CheckBox from "@/app/components/checkBox";
import { success, fail } from "@/app/utils/toast";

import type { Project } from "@/app/type";
import CreateSuccessModal from "./components/createSuccessModal";
import { useUser } from "@/app/store/useUser";
interface Props {
  onAddDataFill: (value: Project) => void;
  show: boolean;
}

export default function CreateNode({ onAddDataFill, show }: Props) {
  const [tokenImg, setTokenImg] = useState<ImageUploadItem[]>([]);
  const [tokenIcon, setTokenIcon] = useState<ImageUploadItem[]>([]);
  const [showTokenSymbol, setShowTokenSymbol] = useState<boolean>(false);

  const [tokenName, setTokenName] = useState("");
  const [ticker, setTicker] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");

  useEffect(() => {
    if (tokenImg && tokenImg.length > 0) {
      const url = tokenImg[0].url;
      if (videoReg.test(url)) {
        setShowTokenSymbol(true);
      }
    }
  }, [tokenImg]);

  return (
    <div className={styles.create} style={{ display: show ? "block" : "none" }}>
      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Name
        </div>
        <div className={styles.groupContent}>
          <input
            value={tokenName}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
            className={styles.inputText}
            placeholder="Meme name"
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Ticker
        </div>
        <div className={styles.groupContent}>
          <input
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
            }}
            className={styles.inputText}
            placeholder="say something"
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Image or Video
        </div>
        <div
          className={styles.groupContent + " " + styles.uploadContent}
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
          <Upload
            accept="image/*, video/mp4"
            fileList={tokenImg}
            setFileList={setTokenImg}
            type="others"
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
              styles.avatar
            }
            style={{ paddingLeft: 15, paddingTop: 10 }}
          >
            <Upload
              fileList={tokenIcon}
              setFileList={setTokenIcon}
              type="token"
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
            className={styles.inputText}
            placeholder="say something"
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>Website</div>
        <div
          className={styles.groupContent}
          style={{ paddingTop: 10, background: "rgba(18, 23, 25, 1)" }}
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

      <div className={styles.btnWapper}>
        <MainBtn
          onClick={() => {
            const isValid = validateVal({
              tokenName,
              ticker,
              about,
              tokenImg,
              tokenIcon
            });
            if (!isValid) {
              fail("isValid params");
              return;
            }

            onAddDataFill({
              tokenName,
              ticker,
              about,
              tokenImg: tokenImg[0].url,
              tokenSymbol: tokenName.toUpperCase(),
              tokenIcon:
                tokenIcon.length > 0 ? tokenIcon[0].url : tokenImg[0].url,
              website,
              twitter,
              telegram,
              discord
            });
          }}
        >
          Preview
        </MainBtn>
      </div>

      {/* <CreateSuccessModal show={true} onHide={() => {}}/> */}
    </div>
  );
}

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
