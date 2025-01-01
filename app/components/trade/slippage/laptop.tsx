import Modal from "@/app/components/modal";
import styles from "./laptop.module.css";
import { useState, useEffect } from "react";

const list = [0.1, 0.5, 1];
export default function Laptop({
  show,
  slipData,
  onSlipDataChange,
  onHide
}: any) {
  const [customVal, setCustomVal] = useState("");
  useEffect(() => {
    show && setCustomVal(list.includes(Number(slipData)) ? "" : slipData);
  }, [show]);
  return (
    <Modal
      open={show}
      onClose={onHide}
      mainStyle={{
        width: 268,
        borderColor: "#9290B199",
        backgroundColor: "#1A1927"
      }}
      closeStyle={{
        transform: "scale(0.8)",
        marginTop: "-10px"
      }}
    >
      <div className={styles.Container}>
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
      </div>
    </Modal>
  );
}
