import styles from './index.module.css';
import AirdropShareInfoCard from '@/app/components/airdrop/share/share-info';
import { useMemo, useRef, useState } from 'react';
import { useAccount } from '@/app/hooks/useAccount';
import { fail, success } from '@/app/utils/toast';
import html2canvas from 'html2canvas';
import { generateRandomString } from '@/app/utils';
import dayjs from 'dayjs';
import Loading from '@/app/components/icons/loading';
import Modal from '@/app/components/modal';

const AirdropShare = (props: any) => {
  const { onClose } = props;

  const { address } = useAccount();

  const cardRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const [downloadSrc, setDownloadSrc] = useState<any>();
  const [downloadFileName, setDownloadFileName] = useState<any>();

  const shareLink = useMemo(() => {
    const _shareLink = new URL(window?.location?.origin);
    _shareLink.searchParams.set("referral", address ?? "");
    _shareLink.searchParams.set("airdrop", "1");
    return _shareLink.toString();
  }, [address]);

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
        const canvas = await html2canvas(cardRef.current, { useCORS: true });

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

  return (
    <div className={styles.AirdropShareContainer}>
      <div ref={cardRef} className={styles.AirdropShareCard}>
        <AirdropShareInfoCard shareLink={shareLink} />
      </div>
      <div className={styles.AirdropShareFooter}>
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
          onClick={handleCopy}
        >
          <img src="/img/airdrop/icon-share.svg" alt="" className={styles.AirdropShareButtonIcon} />
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

export default AirdropShare;
