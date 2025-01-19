import styles from './index.module.css';
import AirdropShareInfoCard from '@/app/components/airdrop/share/share-info';
import { useMemo, useRef, useState } from 'react';
import { useAccount } from '@/app/hooks/useAccount';
import { fail, success } from '@/app/utils/toast';
import html2canvas from 'html2canvas';
import { generateRandomString } from '@/app/utils';
import dayjs from 'dayjs';

const AirdropShare = (props: any) => {
  const { onClose } = props;

  const { address } = useAccount();

  const cardRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);

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
      const canvas = await html2canvas(cardRef.current, { useCORS: true });

      const base64Url = canvas.toDataURL("image/webp");
      const newFileName = generateRandomString(10);
      const link = document.createElement("a");
      link.href = base64Url;
      link.download = `${newFileName}.${dayjs().format('YYYY.MM.DD.HH.mm.ss')}.png`;
      link.click();
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
          Save image
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
    </div>
  );
};

export default AirdropShare;
