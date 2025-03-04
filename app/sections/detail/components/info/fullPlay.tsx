import Modal from "@/app/components/modal";
import { useRef, useState } from "react";
import styles from "./fullPlay.module.css";

interface Props {
  src: string;
  show: boolean;
  onClose: () => void;
}

export default function FullPlay({ src, show, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Modal
      open={show}
      forceNoCloseIcon
      onClose={onClose}
    >
      <div className={styles.container}>
        <div className={styles.closeBtn} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <video
          ref={videoRef}
          src={src}
          className={styles.video}
          playsInline
          controls
          webkit-playsinline
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    </Modal>
  );
}

