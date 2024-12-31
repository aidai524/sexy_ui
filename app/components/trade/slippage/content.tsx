import styles from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";

const list = [0.1, 0.5, 1];
export default function Content({
  onHide,
  token,
  slipData,
  onSlipDataChange,
  isMobile
}: any) {
  return (
    <div className={styles.main} style={{ borderRadius: isMobile ? 0 : 20 }}>
      <div className={styles.title}>Slippage tolerance</div>
      <div className={styles.list}>
        {list.map((item) => {
          return (
            <div
              key={item}
              onClick={() => {
                onSlipDataChange && onSlipDataChange(item);
                console.log(111, item);
              }}
              className={
                styles.item + " " + (slipData === item ? styles.checked : "")
              }
            >
              <div className={styles.amount}>{item}%</div>
              <div className={styles.checkBox}></div>
            </div>
          );
        })}
      </div>

      <div className={styles.inputBox}>
        <input
          value={slipData}
          onChange={(e) => {
            // setInputData(e.target.value as string)
            onSlipDataChange && onSlipDataChange(e.target.value);
          }}
          className={styles.input}
          placeholder="Custom"
        />
        <div className={styles.percent}>%</div>
      </div>

      <MainBtn
        onClick={() => {
          onHide && onHide();
        }}
      >
        Okay
      </MainBtn>
    </div>
  );
}
