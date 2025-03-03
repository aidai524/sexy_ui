import styles from './index.module.css';
import TopTraderShareInfoCard from '@/app/sections/smart/components/TopTraderShare/share-info';
import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useAccount } from '@/app/hooks/useAccount';
import { fail, success } from '@/app/utils/toast';
import html2canvas from 'html2canvas';
import { generateRandomString } from '@/app/utils';
import dayjs from 'dayjs';
import Loading from '@/app/components/icons/loading';
import Modal from '@/app/components/modal';
import {
  LeftBackIcon,
} from "@/app/sections/trends/components/top-traders/icons";
import { useUserAgent } from '@/app/context/user-agent';
import CloseIcon from "@/app/components/icons/modal-close";
import { postUpload, base64ToBlob } from '@/app/utils';
import { getShortUrl, shareToX } from "@/app/utils/share";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://stage.flipn.fun";
const TopTraderShare = (props: any) => {
  const { show, onClose, selectedItems, currentUserInfo, shareName } = props;
  const { isMobile } = useUserAgent();
  const { address } = useAccount();

  const cardRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const [downloadSrc, setDownloadSrc] = useState<any>();
  const [downloadFileName, setDownloadFileName] = useState<any>();
  const [shareImgUrl, setShareImgUrl] = useState<any>();

  const shareLink = useMemo(() => {
    const _shareLink = new URL(window?.location?.origin + '/smartTopDetail');
    _shareLink.searchParams.set("address", shareName ?? "");
    _shareLink.searchParams.set("referrer", 'top-trader-share');
    return _shareLink.toString();
  }, [shareName]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareLink.toString())
      .then(() => {
        success("Copied share link!", { maskStyle: { zIndex: 2000 } });
        const timer = setTimeout(() => {
          clearTimeout(timer);
          onClose?.();
        }, 1000);
      })
      .catch((err) => {
        fail("Copy failed!", { maskStyle: { zIndex: 2000 } });
      })
      .finally(() => {
      });
  };

  const getShareImage = async () => {
    if (loading) return;
    setLoading(true);
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, { useCORS: true,backgroundColor: null  });

        const base64Url = canvas.toDataURL("image/webp");
        const newFileName = generateRandomString(10);
        // setDownloadSrc(base64Url);
        // setDownloadFileName(`${newFileName}.${dayjs().format('YYYY.MM.DD.HH.mm.ss')}.png`);
        // setDownloadVisible(true);
        const link = document.createElement("a");
        link.href = base64Url;
        link.download = `${newFileName}.${dayjs().format('YYYY.MM.DD.HH.mm.ss')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err: any) {
        console.log('get share image failed: %o', err);
        fail(`Got share image failed${err?.message ? ': ' + err?.message : ''}`);
      }
    }
    setLoading(false);
  };



  const getShareImg = async () => {
    if (loading) return;
    setLoading(true);
    
    if (cardRef.current) {
      try {
        const element = cardRef.current;
        const originalWidth = 400;  
        const originalHeight = 550; 
        const targetWidth = 400;  
        const scale = targetWidth / originalWidth;
        
        // 
        const targetHeight = originalHeight * scale;

        const canvas = await html2canvas(element, { 
          useCORS: true,
          backgroundColor: '#000',
          scale: scale,
          logging: false,
          width: targetWidth / scale,
          height: targetHeight / scale,
          imageTimeout: 0,
          allowTaint: true,
          x: (targetWidth / scale - originalWidth) / 2,
          y: (targetHeight / scale - originalHeight) / 2,
        });

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, 'image/webp', 0.8);
        });

        const url = await postUpload(blob, shareName!, 'image/webp');
        if (url) {
          console.log('Upload successful:', url);
          setShareImgUrl(url);
        }
      } catch (err: any) {
        console.error('Share image generation/upload failed:', err);
        fail(`Failed to generate/upload share image${err?.message ? ': ' + err?.message : ''}`);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    getShareImg();
  }, []);


  const handleCopyX = async () => {
    if (shareImgUrl) {
      const longUrl = `${domain}/api/smart?address=${encodeURIComponent(
        shareName
      )}&imgUrl=${encodeURIComponent(
        shareImgUrl
      )}&title=${encodeURIComponent(
        'Top Trader Share'
      )}&about=${encodeURIComponent('flip top trader')}`;
      const shortUrl = await getShortUrl(longUrl);
      shareToX('Check out this top trader on Flipn! 🚀', shortUrl);
    }
  }

  return (
    <div className={isMobile ? styles.CopyTradeShareContainer : styles.CopyTradeShareContainerPC}>
      {
        isMobile ? (
          <div className={styles.TopTraderShareHeader} onClick={onClose}>
          <LeftBackIcon />
          <span className={styles.TopTraderShareHeaderTitle}>Share</span>
        </div>
        ) : (
          <div className={styles.TopTraderShareHeaderPC} onClick={onClose}>
            <CloseIcon size={35} />
          </div>
        )
      }
        
      <div ref={cardRef} className={styles.CopyTradeShareCard}>
        <TopTraderShareInfoCard shareName={shareName} shareLink={shareLink} selectedItems={selectedItems} currentUserInfo={currentUserInfo} />
      </div>
      <div className={isMobile ? styles.CopyTradeShareFooter : styles.CopyTradeShareFooterPC}>
        <button
          type="button"
          className={styles.AirdropShareButtonDark}
          onClick={getShareImage}
          disabled={loading}
        >
          {
            loading && (
              <Loading size={14} />
            )
          }
          <span>Save image</span>
        </button>
        <button
          type="button"
          className={styles.AirdropShareButtonPrimary}
          onClick={isMobile ? handleCopy : handleCopyX}
          disabled={loading}
        >
           {
            loading && (
              <Loading size={14} />
            )
          }
          <span>Share</span>
        </button>
      </div>
      {/*#region useless currently*/}
      <Modal
        open={downloadVisible}
        onClose={() => {
          setDownloadVisible(false);
        }}
      >
        <div className={styles.AirdropDownloadModalCard}>
          <div className={styles.AirdropDownloadModalTitle}>
            Shareable image is ready
          </div>
          <div className={styles.AirdropDownloadModalDesc}>
            Click the button below to download immediately
          </div>
          <a
            href={downloadSrc}
            download={downloadFileName}
            className={styles.AirdropDownloadModalButton}
          >
            Download
          </a>
        </div>
      </Modal>
      {/*#endregion*/}
    </div>
  );
};

export default TopTraderShare;
