import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect
} from "react";
import type { Project } from "@/app/type";
import styles from "./card.module.css";
import html2canvas from "html2canvas";
import {
  base64ToBlob,
  checkFileType,
  formatAddress,
  generateRandomString,
  postUpload,
  simplifyNum,
  httpGet,
} from "@/app/utils";
import QRCode from "../qrcode";
import TokenTags from "../tokenTags";
import { useAuth } from "@/app/context/auth";
import Level from "../level";
import { fail } from "@/app/utils/toast";
import { getShortUrl, shareToX } from "@/app/utils/share";
import Modal from "../modal";
import useHolders from "@/app/sections/home/mobile/hooks/use-holders";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import Big from "big.js";
import Media from "../thumbnail/media";

interface Props {
  token: Project | undefined;
  show: boolean;
  isNew?: boolean;
  onClose: () => void;
}

const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://stage.flipn.fun";

function Card({ token, show, onClose }: Props, ref: any) {
  const containerRef = useRef(null);
  const { userInfo } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { total: totalHolders } = useHolders(token);
  const pumpMc = useMcWithPump(token);
  const canvasRef = useRef<any>(null);
  const [qrcodeCanvas, setQrcodeCanvas] = useState<any>(null);
  const [shareCopy, setShareCopy] = useState("");

  useImperativeHandle(ref, () => ({
    getShareImg
  }));


  const getShareImg = useCallback(async () => {
    if (token && containerRef.current && qrcodeCanvas) {
      const canvas = await html2canvas(containerRef.current, { useCORS: true, scale: 5, backgroundColor: '#000000' });
      canvasRef.current = canvas;
      // const base64Url = canvas.toDataURL("image/webp");
      // const newFileName = generateRandomString(10);
      // Create a new canvas with 375x625 dimensions
      const canvas2 = document.createElement('canvas');
      canvas2.width = 1000;
      canvas2.height = 500;

      const ctx = canvas2.getContext('2d');
      if (ctx) {
        // Fill entire canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);

        // Calculate scaling factor to fit within canvas2
        const scale = Math.min(
          canvas2.width / canvas.width,
          canvas2.height / canvas.height
        );

        // Calculate dimensions after scaling
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;

        // Calculate position to center scaled image
        const x = (canvas2.width - scaledWidth) / 2;
        const y = (canvas2.height - scaledHeight) / 2;

        // Draw scaled and centered image
        ctx.drawImage(
          canvas,
          x, y,
          scaledWidth,
          scaledHeight
        );


        const base64Url = canvas2.toDataURL("image/webp");
        const bloBData = base64ToBlob(base64Url);
        const url = await postUpload(bloBData[0], token.address!, bloBData[1]);
        console.log("url:", url);
      }

      return token.address!;
    }
  }, [token, qrcodeCanvas]);

  useEffect(() => {
    (async () => {
      if (token) {
        if (isSharing) {
          return;
        }

        setIsSharing(true);
        const img = await getShareImg();
        if (!img) {
          fail("Share fail");
          setIsSharing(false);
          return;
        }
        setIsSharing(false);
      }
    })();
  }, [token, qrcodeCanvas]);

  useEffect(() => {
    (async () => {
      if (token) {
        const longUrl = `${domain}/api/twitter?tokenName=${encodeURIComponent(
          token.tokenName
        )}&about=${encodeURIComponent(token.about)}&imgUrl=${encodeURIComponent(
          token.address!
        )}&address=${token.address}&referral=${userInfo.address}`;

        console.log('longUrl:', longUrl)

        const shareUrl = await getShortUrl(longUrl);
        console.log('shareUrl:', shareUrl)
        setShareUrl(shareUrl);
      }
    })();
  }, [token]);


  useEffect(() => {
    const getShareCopy = async () => {
      if (token) {
        try {
          const v = await httpGet('/project/sharing_copy');
          if (v.code === 0) {
            setShareCopy(v.data.SharingCopy || '');
          }
        } catch (error) {
          console.error('Failed to fetch share copy:', error);
        }
      }
    };

    getShareCopy();
  }, [token]);

  if (!token || !show) return null;


  return (
    <Modal
      open={show}
      onClose={() => {
        onClose();
        setShareUrl('');
      }}
      closeIcon={<></>}
      mainStyle={{
        border: 0
      }}
      closeStyle={{
        top: 55,
        display: "none"
      }}
      maskClose={true}
    >
      <div className={styles.cardWrapper}>
        <div
          ref={containerRef}
          className={styles.cardContainer}
          onClick={() => {

          }}
        >
          <img src="/img/share/logo.png" alt="Flip" className={styles.logo} />
          <div className={styles.header}>
            <img
              src="/img/share/subTitle.png"
              alt="Flip"
              className={styles.subTitle}
            />

          </div>

          {/* Main Card Content */}
          <div className={styles.mainCard}>
            {
              token?.status === 0 && (
                <div className={styles.stats}>
                  <div className={styles.statsFlip}>
                    {Number(token?.prePaidAmount) >= 10e9 ? (
                      <div className={styles.statsFlipText}>
                        <span className={styles.statsFlipTextTitle}>Flipped</span>
                        <span className={styles.statsFlipTextCount}>
                          {simplifyNum(new Big(token?.prePaidAmount || '').div(10 ** 9).toNumber(), 2)} SOL
                        </span>
                      </div>
                    ) : (
                      <div className={styles.statsFlipText}>
                        <span>Flip it!</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.statsLike}>
                    {Number(token?.like) >= 50 ? (
                      <div className={styles.statsLikeText}>
                        <span className={styles.statsLikeTextTitle}>Liked</span>
                        <span className={styles.statsLikeTextCount}>
                          {token.like || 0}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.statsLikeText}>
                        <span>Like it!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {
              token?.status !== 0 && (
                <div className={styles.statsLaunches}>
                  <div className={styles.statsBuyMe}>
                    <img src="/img/share/buy.png" alt="Flip" className={styles.buyMe} />
                  </div>
                  <div className={styles.statsFlip}>
                    <div className={styles.statsFlipText}>
                      <span className={styles.statsFlipTextTitle}>Marketcap</span>
                      <span className={styles.statsFlipTextCount}>
                        {pumpMc === 0 || pumpMc === "0" || pumpMc === "-" ? (
                          <div>$-</div>
                        ) : (
                          <div>
                            ${simplifyNum(pumpMc as number, 2)}
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={styles.statsHolder}>
                    <div className={styles.statsHolderText}>
                      <span className={styles.statsHolderTextTitle}>holders</span>
                      <span className={styles.statsHolderTextCount}>
                        {totalHolders}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }

            <div className={styles.tokenImage}>
              {
                checkFileType(token.tokenImg) === 'video' ? (
                  <img
                    src={token.tokenIcon || '/img/token-placeholder.png'}
                    alt={token.tokenName}
                    className={styles.tokenImg}
                  />
                ) : (
                  <img
                    src={token.tokenImg || token.tokenIcon || '/img/token-placeholder.png'}
                    alt={token.tokenName}
                    className={styles.tokenImg}
                  />
                )
              }

            </div>
          </div>

          <div className={styles.tokenInfo}>
            <div className={styles.tokenIcon}>
              <img src={token.tokenIcon || '/img/token-icon-placeholder.svg'} alt="Flip" className={styles.badge} />
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.tokenName}>{token.tokenName}</div>

              <div className={styles.tokenTicker}>
                {token.ticker && (
                  <div>
                    Ticker:{" "}
                    <span className={styles.createdByAddress}>{token.ticker}</span>
                  </div>
                )}
                <TokenTags token={token} />
              </div>
              <div className={styles.createdBy}>
                Created by{" "}
                <span className={styles.createdByAddress}>
                  @
                  {token.creater?.name ||
                    formatAddress(token.account || "")}
                </span>
              </div>
            </div>

            <img src="/img/share/tie.png" alt="Flip" className={styles.tie} />
          </div>

          {/* Footer with QR Code */}
          <div className={styles.footer}>
            <div className={styles.inviteBox}>
              <div>
                <img
                  src={userInfo?.icon || "/img/share/invite.png"}
                  alt="Flip"
                  className={styles.invite}
                />
              </div>
              <div className={styles.inviteInfo}>
                <div>Inviter:</div>
                <div className={styles.inviteAddress}>
                  {formatAddress(userInfo?.address || "")}
                  <div style={{ transform: 'scale(0.8)', marginLeft: 10 }}>
                    <Level level={userInfo?.level || 0} />
                  </div>
                </div>
                <div className={styles.inviteUrl}>
                  {shareUrl}
                </div>
              </div>
            </div>
            <div className={styles.qrcode1}>
              <QRCode
                url={shareUrl}
                size={60}
                onSuccess={(canvas: any) => {
                  setQrcodeCanvas(true);
                }}
              />
              {/*<img src="/img/share/qr-logo.png" alt="Flip" className={styles.qrLogo} />*/}
            </div>

            <img src="/img/share/scan.png" alt="Flip" className={styles.scan} />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.saveButton} style={{ opacity: shareUrl && canvasRef.current && !isSharing ? 1 : 0.5 }} onClick={() => {
            if (shareUrl && canvasRef.current && !isSharing) {
              const link = document.createElement('a');
              link.download = `${token?.tokenName || 'flip'}.png`;
              link.href = canvasRef.current.toDataURL('image/png');
              link.click();
            } else {
              fail("Wait for a while");
            }
          }}>Save image</button>
          <button className={styles.shareButton} style={{ opacity: shareUrl && canvasRef.current && !isSharing ? 1 : 0.5 }} onClick={async () => {
            if (shareUrl && canvasRef.current && !isSharing) {
              shareToX(shareCopy, shareUrl);
              onClose();
            }
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0101 14.7104C9.99621 14.8066 10.0055 14.9047 10.0373 14.9969C10.0692 15.0891 10.1226 15.1729 10.1935 15.2417L10.1991 15.2461C10.2609 15.3086 10.3351 15.3584 10.4173 15.3924C10.4994 15.4265 10.5879 15.4441 10.6772 15.4443C10.8853 15.4443 11.0631 15.3463 11.1857 15.2036L17.8074 8.20618C17.8734 8.14237 17.9247 8.06565 17.9576 7.98115C17.9906 7.89665 18.0046 7.8063 17.9986 7.71616C18.0047 7.626 17.9907 7.53564 17.9578 7.45113C17.9248 7.36661 17.8735 7.2899 17.8074 7.22614L11.1486 0.189487C11.0211 0.0680545 10.8494 0 10.6705 0C10.4916 0 10.3199 0.0680545 10.1924 0.189487C10.1218 0.258539 10.0687 0.342407 10.0371 0.43457C10.0055 0.526734 9.99624 0.624711 10.0101 0.720888V4.51036C4.48195 4.51036 3.8411e-07 8.82905 3.8411e-07 14.1583C-0.000380367 15.4806 0.28231 16.7887 0.830245 18C1.62 13.9819 5.60018 10.9296 9.99887 10.9296L10.0101 14.7104Z" fill="black" />
            </svg>
            Share</button>
        </div>
      </div>
    </Modal>
  );
}

export default forwardRef(Card);
