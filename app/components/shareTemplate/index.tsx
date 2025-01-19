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
  formatAddress,
  generateRandomString,
  postUpload,
  simplifyNum
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

  useImperativeHandle(ref, () => ({
    getShareImg
  }));

  const getShareImg = useCallback(async () => {
    if (token && containerRef.current) {
      const canvas = await html2canvas(containerRef.current, { useCORS: true });
      // const base64Url = canvas.toDataURL("image/webp");
      const newFileName = generateRandomString(10);
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
        const url = await postUpload(bloBData[0], newFileName, bloBData[1]);
        console.log("url:", url);
      }
      
      return newFileName;
    }
  }, [token]);

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

        const longUrl = `${domain}/api/twitter?tokenName=${encodeURIComponent(
          token.tokenName
        )}&about=${encodeURIComponent(token.about)}&imgUrl=${encodeURIComponent(
          img
        )}&address=${token.address}&referral=${userInfo.address}`;

        try {
          const shareUrl = await getShortUrl(longUrl);
          console.log("shareUrl:", shareUrl);
          setShareUrl(shareUrl);
          // shareToX(token.tokenName, shareUrl);
        } catch (e) {
          fail("Share fail");
          setIsSharing(false);
          return;
        }

        setIsSharing(false);
      }
    })();
  }, [token]);

  if (!token || !show) return null;

  console.log("token:", token);

  return (
    <Modal
      open={show}
      onClose={() => {
        onClose();
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
      <div
        ref={containerRef}
        className={styles.cardContainer}
        onClick={() => {
          if (shareUrl) {
            shareToX(token.tokenName, shareUrl);
          }
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
                  {Number(token?.prePaidAmount) > 0 ? (
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
                  {Number(token?.like) > 0 ? (
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
            <img
              src={token.tokenIcon}
              alt={token.tokenName}
              className={styles.tokenImg}
            />
          </div>
        </div>

        <div className={styles.tokenInfo}>
          <div className={styles.tokenIcon}>
            <img src={token.tokenIcon} alt="Flip" className={styles.badge} />
          </div>
          <div>
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
                src="/img/share/invite.png"
                alt="Flip"
                className={styles.invite}
              />
            </div>
            <div className={styles.inviteInfo}>
              <div>Inviter:</div>
              <div className={styles.inviteAddress}>
                {formatAddress(userInfo?.address || "")}
                <Level level={userInfo?.level || 0} />
              </div>
              <div className={styles.inviteUrl}>
                flipn.fun/invite/{formatAddress(userInfo?.address || "")}
              </div>
            </div>
          </div>
          <QRCode
            url={`${domain}/api/twitter?address=${token.address}&referral=${userInfo.address}`}
            size={50}
          />
          <img src="/img/share/scan.png" alt="Flip" className={styles.scan} />
        </div>
      </div>
    </Modal>
  );
}

export default forwardRef(Card);
