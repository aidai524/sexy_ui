import { Button, type ImageUploadItem } from "antd-mobile";
import styles from "./create.module.css";
import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef
} from "react";
import Upload, { videoReg } from "@/app/components/upload";
import Link from "./components/link";
import MainBtn from "@/app/components/mainBtn";
import CheckBox from "@/app/components/checkBox";
import { useUserAgent } from "@/app/context/user-agent";
import ErrMsg from "./components/errMsg";
import type { Project } from "@/app/type";
import { httpGet, isValidURL } from "@/app/utils";
import StepAction from "./components/stepAction";


interface Props {
  onAddDataFill: (value: Project) => void;
  step: number;
  onNext: () => void;
  onBack: () => void;
}

const name_reg = /^[a-zA-Z0-9]{1,10}$/;

export default forwardRef(function CreateNode(
  { onAddDataFill, step, onNext, onBack }: Props,
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


  const [nameLength, setNameLength] = useState(20);
  const [tickerLength, setTickerLength] = useState(10);
  const [aboutLength, setAboutLength] = useState(1000);

  const [canValid, setCanValid] = useState(false);
  const [inValidVals, setInvaldVasl] = useState<any>({});
  const imgRef = useRef<any>(null);
  const [isImgUploaded, setIsImgUploaded] = useState(false);

  const [links, setLinks] = useState<any>({
    x: {
      isLink: true,
      value: x,
      type: "X",
      img: "/img/community/x.svg",
      show: true,
      onChange: (val: string) => {
        setTwitter(val);
        setLinks({ ...links, x: { ...links.x, value: val } });
      },
      onBlur: () => {
        const xError = validateTwitter(x);
        if (xError) {
          setInvaldVasl({ ...inValidVals, x: xError });
        } else {
          setInvaldVasl({ ...inValidVals, x: "" });
        }
      }
    },
    website: {
      isLink: false,
      value: website,
      type: "Website",
      img: "/img/community/website.svg",
      show: false,
      onChange: (val: string) => {
        setWebsite(val);
        setLinks({ ...links, website: { ...links.website, value: val } });
      },
      onBlur: () => {
        const websiteError = validateWebsite(website);
        if (websiteError) {
          setInvaldVasl({ ...inValidVals, website: websiteError });
        } else {
          setInvaldVasl({ ...inValidVals, website: "" });
        }
      }
    },
    tg: {
      isLink: true,
      value: tg,
      type: "Telegram",
      img: "/img/community/telegram.svg",
      show: false,
      onChange: (val: string) => {
        setTelegram(val);
        setLinks({ ...links, tg: { ...links.tg, value: val } });
      },
      onBlur: () => {
        const tgError = validateTelegram(tg);
        if (tgError) {
          setInvaldVasl({ ...inValidVals, tg: tgError });
        } else {
          setInvaldVasl({ ...inValidVals, tg: "" });
        }
      }
    },
    discord: {
      isLink: true,
      value: discord,
      type: "Discord",
      img: "/img/community/discard.svg",
      show: false,
      onChange: (val: string) => {
        setDiscord(val);
        setLinks({ ...links, discord: { ...links.discord, value: val } });
      },
      onBlur: () => {
        const discordError = validateDiscord(discord);
        if (discordError) {
          setInvaldVasl({ ...inValidVals, discord: discordError });
        } else {
          setInvaldVasl({ ...inValidVals, discord: "" });
        }
      }
    }
  })

  const validateSameName = useCallback(async () => {
    const tokenInUse = await httpGet(
      `/project?token_name=${tokenName}&token_symbol=${ticker.toUpperCase()}`
    );

    if (tokenInUse.code === 0 && tokenInUse.data?.length > 0) {
      return "Token name already in use";
    }

    return "";
  }, [tokenName, ticker]);

  const validateName = useCallback(
    (tokenName: string) => {
      if (!tokenName) {
        return "Token name cannot be empty";
      }

      if (tokenName.length > 20) {
        return "Token name cannot exceed 20";
      }

      return "";
    },
    []
  );

  const validateTicker = useCallback(
    (ticker: string) => {
      if (!ticker) {
        return "Ticker cannot be empty";
      }

      if (!name_reg.test(ticker)) {
        return "Only uppercase and lowercase letters and numbers are supported and the length is less than 10";
      }

      return "";
    },
    [tokenName]
  );

  const validateIcon = useCallback(
    (tokenIcon: ImageUploadItem[]) => {
      if (tokenIcon.length === 0) {
        return "Token icon cannot be empty";
      }

      return "";
    },
    [tokenName]
  );

  const validateImages = useCallback(
    (
      tokenImg: ImageUploadItem[],
    ) => {
      if (tokenImg.length === 0) {
        return "Token image cannot be empty";
      }

      return "";
    },
    []
  );

  const validateAbout = useCallback((about: string) => {
    // if (!about) {
    //   return "Discription cannot be empty";
    // }

    if (about.length > 1000) {
      return "Discription cannot be length than 1000";
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

  const onPreview = useCallback(async (type: number) => {
    const inValidVals: any = {};
    let isValid = false;

    if (type === 1) {
      const iconError = validateIcon(tokenIcon);
      if (iconError) {
        inValidVals["tokenIcon"] = iconError;
        isValid = true;
      }

      const nameError = validateName(tokenName);
      if (nameError) {
        inValidVals["tokenName"] = nameError;
        isValid = true;
      }

      const sameNameError = await validateSameName();
      if (sameNameError) {
        inValidVals["tokenName"] = sameNameError;
        isValid = true;
      }

      const tickerError = validateTicker(ticker);
      if (tickerError) {
        inValidVals["ticker"] = tickerError;
        isValid = true;
      }

      const aboutError = validateAbout(about);
      if (aboutError) {
        inValidVals["about"] = aboutError;
        isValid = true;
      }

      setInvaldVasl(inValidVals);
      return isValid;
    }

    const imagesError = validateImages(tokenImg);
    if (imagesError) {
      inValidVals["tokenImg"] = imagesError;
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
      return isValid;
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

    return isValid;
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
        display: step <= 2 ? "block" : "none",
        paddingBottom: isMobile ? 150 : 20
      }}
    >
      {step === 1 && <>
        <div>
          <div
            className={
              styles.uploadContent +
              " " +
              styles.avatar +
              " " +
              (inValidVals["tokenIcon"] ? styles.uploadError : "")
            }
          >
            <Upload
              percent={1}
              type="avatar"
              cropper={true}
              accept="image/png, image/jpg, image/jpeg, image/svg"
              fileList={tokenIcon}
              setFileList={(fileList: any) => {
                setTokenIcon(fileList)
                if (!isImgUploaded) {
                  setTokenImg(fileList)
                }
              }}
            />
            <div>
              <div className={styles.uploadTitle}>Token icon</div>
              <div className={styles.uploadTip}>Support jpg/png/svg/gif</div>
            </div>
          </div>
          {inValidVals["tokenIcon"] && (
            <ErrMsg>{inValidVals["tokenIcon"]}</ErrMsg>
          )}
        </div>

        <div
          className={styles.group}
          style={{
            width: isMobile ? "100%" : "calc(50% - 10px)"
          }}
        >
          <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
            <div>
              <span className={styles.require}>* </span>
              Name
            </div>
            <div className={styles.requireSize}>{nameLength}</div>
          </div>
          <div className={styles.groupContent}>
            <input
              value={tokenName}
              maxLength={20}
              onChange={(e) => {
                setTokenName(e.target.value);
                setNameLength(Math.max(20 - e.target.value.length, 0));
              }}
              onBlur={async () => {
                let nameError = validateName(tokenName);
                if (!nameError) {
                  nameError = await validateSameName();
                }
                if (nameError) {
                  setInvaldVasl({ ...inValidVals, tokenName: nameError });
                } else {
                  setInvaldVasl({ ...inValidVals, tokenName: "" });
                }
              }}
              className={`${isMobile ? styles.inputText : styles.laptopInputText
                } ${inValidVals["tokenName"] ? styles.inputError : ""}`}
              placeholder="Full Token Name"
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
            <div>
              <span className={styles.require}>* </span>
              Ticker
            </div>
            <div className={styles.requireSize}>{tickerLength}</div>
          </div>
          <div className={styles.groupContent}>
            <input
              value={ticker}
              maxLength={10}
              onChange={(e) => {
                setTicker(e.target.value);
                setTickerLength(Math.max(10 - e.target.value.length, 0));
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
              className={`${isMobile ? styles.inputText : styles.laptopInputText
                } ${inValidVals["ticker"] ? styles.inputError : ""}`}
              placeholder="Short symbol for exchanges"
            />
          </div>
          {inValidVals["ticker"] && <ErrMsg>{inValidVals["ticker"]}</ErrMsg>}
        </div>

        <div className={styles.group}>
          <div className={isMobile ? styles.groupTitle : styles.TitlePc}>
            <div>
              Discription
            </div>
            <div className={styles.requireSize}>{aboutLength}</div>
          </div>
          <div className={styles.groupContent}>
            <textarea
              value={about}
              maxLength={1000}
              onChange={(e) => {
                setAbout(e.target.value);
                setAboutLength(Math.max(1000 - e.target.value.length, 0));
              }}
              onBlur={() => {
                const aboutError = validateAbout(about);
                if (aboutError) {
                  setInvaldVasl({ ...inValidVals, about: aboutError });
                } else {
                  setInvaldVasl({ ...inValidVals, about: "" });
                }
              }}
              style={{ height: 100, padding: 10 }}
              className={`${styles.inputText} ${inValidVals["about"] ? styles.inputError : ""
                } ${!isMobile && styles.laptopInputText}`}
              placeholder="Say something"
            />
          </div>
          {inValidVals["about"] && <ErrMsg>{inValidVals["about"]}</ErrMsg>}
        </div>
      </>}

      {
        step === 2 && <>
          <div className={styles.group}>
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
                key={Date.now()}
                ref={imgRef}
                percent={-1}
                type="token"
                accept="image/*, video/mp4"
                fileList={tokenImg}
                setFileList={(fileList: any) => {
                  setTokenImg(fileList)
                  setIsImgUploaded(true)
                }}
              />
              <div className={styles.uploadImgWrapper}>
                <div className={styles.uploadTitle}>Video or image</div>
                <div className={styles.uploadTip}>Support MOV/mp4/jpg/png/gif, <br />up to 10 MB</div>
                <div className={styles.uploadAction} onClick={() => {
                  if (!isImgUploaded) {
                    imgRef.current?.open()
                  } else {
                    setTokenImg(tokenIcon)
                    setIsImgUploaded(false)
                  }
                }}>
                  {
                    isImgUploaded
                      ? <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="15" fill="#21252E" />
                        <path d="M16.8728 9.37201H14.2728C14.0935 9.37201 13.9407 9.43613 13.8129 9.56642C13.6863 9.69671 13.6225 9.85417 13.6225 10.039V10.704H17.5227V10.039C17.5227 9.85417 17.4586 9.69671 17.3322 9.56642C17.2046 9.43613 17.0518 9.37201 16.872 9.37201H16.8728ZM19.4725 20.0372V12.0379H11.6723V20.0374C11.6723 20.2201 11.7362 20.3776 11.8628 20.5079C11.9904 20.6382 12.1434 20.7043 12.3228 20.7043H18.8225C19.0019 20.7043 19.1554 20.6382 19.2819 20.5079C19.4097 20.3776 19.4728 20.2201 19.4728 20.0373H19.4724L19.4725 20.0372ZM14.2725 8.03809H16.872C17.4103 8.03809 17.8701 8.2325 18.251 8.62329C18.6316 9.01417 18.8222 9.48475 18.8222 10.037V10.7039H21.422C21.6013 10.7039 21.7549 10.77 21.8814 10.8984C22.0089 11.0305 22.0723 11.1861 22.0723 11.3708C22.0723 11.5556 22.0089 11.7111 21.8814 11.8434C21.7549 11.9717 21.6014 12.0378 21.422 12.0378H20.772V20.0373C20.772 20.5895 20.5816 21.06 20.201 21.4508C19.8201 21.8417 19.3601 22.0381 18.8222 22.0381H12.3225C11.7841 22.0381 11.3246 21.8417 10.9437 21.4508C10.5628 21.06 10.3725 20.5895 10.3725 20.0373V12.0377H9.72254C9.54327 12.0377 9.39045 11.9716 9.26281 11.8433C9.13599 11.7111 9.07227 11.5555 9.07227 11.3708C9.07227 11.1861 9.1359 11.0306 9.26281 10.8984C9.39045 10.77 9.54327 10.7039 9.72254 10.7039H12.3225V10.037C12.3225 9.48475 12.5129 9.01417 12.8937 8.62338C13.2744 8.2325 13.7338 8.03809 14.2725 8.03809Z" fill="white" />
                      </svg>
                      :
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="15" fill="#21252E" />
                        <path d="M8.72964 15.9921C8.18125 15.8932 8.18125 15.1068 8.72964 15.0079L13.7073 14.1106C13.9127 14.0736 14.0736 13.9127 14.1106 13.7073L15.0079 8.72964C15.1068 8.18125 15.8932 8.18125 15.9921 8.72964L16.8894 13.7073C16.9264 13.9127 17.0873 14.0736 17.2927 14.1106L22.2704 15.0079C22.8187 15.1068 22.8187 15.8932 22.2704 15.9921L17.2927 16.8894C17.0873 16.9264 16.9264 17.0873 16.8894 17.2927L15.9921 22.2704C15.8932 22.8187 15.1068 22.8187 15.0079 22.2704L14.1106 17.2927C14.0736 17.0873 13.9127 16.9264 13.7073 16.8894L8.72964 15.9921Z" fill="white" />
                      </svg>
                  }
                </div>
              </div>
            </div>
            {inValidVals["tokenImg"] && <ErrMsg>{inValidVals["tokenImg"]}</ErrMsg>}
          </div>

          <div className={styles.group}>
            <div
              className={styles.Flex}
              style={{
                columnGap: isMobile ? 0 : 20
              }}
            >
              {
                Object.keys(links).map((key: any) => {
                  if (links[key].show) {
                    return <div
                      className={isMobile ? styles.groupContent : styles.LinkPc}
                      style={{
                        width: "100%"
                      }}
                      key={key}
                    >
                      <Link
                        value={links[key].value}
                        onChange={(val) => {
                          links[key].onChange(val);
                        }}
                        onBlur={() => {
                          links[key].onBlur();
                        }}
                        onDelete={() => {
                          links[key].onChange('');
                          links[key].show = false;
                          setLinks({ ...links });
                        }}
                        type={links[key].type}
                        img={links[key].img}
                        isLink={links[key].isLink}
                        hideDelete={key === "x"}
                      />

                      {inValidVals[key] && <ErrMsg>{inValidVals[key]}</ErrMsg>}
                    </div>
                  }
                })
              }
            </div>

            {
              Object.keys(links).some((key: any) => !links[key].show) && (
                <div className={styles.linkActionGroup}>
                  <div>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.16 9.816V0.856H5.76V9.816H4.16ZM0.48 6.136V4.536H9.44V6.136H0.48Z" fill="#9290B1" />
                    </svg>
                  </div>

                  {
                    Object.keys(links).map((key: any) => {
                      if (!links[key].show) {
                        return <div className={styles.linkActionItem} key={key} onClick={() => {
                          links[key].show = true;
                          setLinks({ ...links });
                        }}>
                          <img src={links[key].img} alt={links[key].type} />
                        </div>
                      }
                    })
                  }
                </div>
              )
            }
          </div>
        </>
      }

      <StepAction
        step={step}
        onBack={onBack}
        onNext={async () => {
          const isValid = await onPreview(step);
          if (!isValid) {
            onNext();
          }
        }}
      />
    </div>
  );
});
