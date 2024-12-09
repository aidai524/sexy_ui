import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CloseIcon from "../icons/close";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: React.CSSProperties;
  mainStyle?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  closeIcon,
  style,
  mainStyle
}) => {
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
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };
  return ReactDOM.createPortal(
    (
      <AnimatePresence mode="wait">
        <div
          className={styles.Container}
          style={style}
          onClick={handleBackdropClick}
        >
          <div className={styles.Main} style={mainStyle}>
            {closeIcon || onClose ? (
              <button onClick={onClose} className={styles.CloseButton}>
                <CloseIcon />
              </button>
            ) : null}
            <motion.div
              animate={{
                y: [100, 0],
                transition: {
                  duration: 0.3
                }
              }}
              exit={{
                y: [0, 100]
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
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
