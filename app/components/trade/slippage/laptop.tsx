import styles from "./laptop.module.css";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const list = [0.1, 0.5, 1];
export default function Laptop({
  show,
  slipData,
  onSlipDataChange,
  onHide,
  textRef
}: any) {
  const [customVal, setCustomVal] = useState("");

  useEffect(() => {
    show && setCustomVal(list.includes(Number(slipData)) ? "" : slipData);
  }, [show]);

  useEffect(() => {
    document.addEventListener("click", onHide);
    return () => {
      document.removeEventListener("click", onHide);
    };
  }, []);

  if (!show || !textRef.current) return null;
  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className={styles.Container}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
      >
        <div className={styles.Title}>Set max slippage</div>
        <div className={styles.Labels}>
          {list.map((item: number) => (
            <button
              key={item}
              className={`${styles.Label} ${
                Number(slipData) === item && styles.ActiveLabel
              }`}
              onClick={() => {
                onSlipDataChange?.(item);
                setCustomVal("");
              }}
            >
              {item}%
            </button>
          ))}
        </div>
        <div className={styles.InputWrapper}>
          <input
            className={styles.Input}
            placeholder="Custom"
            value={customVal}
            onChange={(ev: any) => {
              setCustomVal(ev.target.value);
              if (!isNaN(ev.target.value)) {
                onSlipDataChange?.(ev.target.value);
              }
            }}
          />
          <span>%</span>
        </div>
      </motion.div>
    </AnimatePresence>,
    textRef.current
  );
}
