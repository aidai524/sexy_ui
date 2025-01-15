import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import CloseIcon from "../icons/close";
import { AnimatePresence, motion } from "framer-motion";
import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";
import animations from "./animations";

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: React.CSSProperties;
  mainStyle?: React.CSSProperties;
  closeStyle?: React.CSSProperties;
  maskClose?: boolean;
  animation?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  closeIcon,
  style,
  mainStyle,
  closeStyle,
  maskClose = true,
  animation = "modal"
}) => {
  const { innerHeight, innerWidth } = useUserAgent();
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!maskClose) return;
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return ReactDOM.createPortal(
    (
      <AnimatePresence mode="wait">
        <div
          className={styles.Container}
          style={{ ...style, height: innerHeight, width: innerWidth }}
          onClick={handleBackdropClick}
        >
          <div
            className={styles.Main}
            style={{
              ...mainStyle,
              ...(animation === "popup"
                ? {
                    position: "absolute",
                    left: 0,
                    bottom: 0
                  }
                : {})
            }}
          >
            <motion.div
              {...animations[animation]}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {closeIcon || onClose ? (
                <button
                  onClick={onClose}
                  className={styles.CloseButton}
                  style={closeStyle}
                >
                  <CloseIcon />
                </button>
              ) : null}
              {children}
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    ) as any,
    document.body
  ) as unknown as React.ReactPortal;
};

export default Modal;
