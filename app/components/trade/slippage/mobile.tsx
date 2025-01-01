import { Popup } from "antd-mobile";
import styles from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";

interface Props {
  show: boolean;
  token: any;
  slipData?: number | string;
  onSlipDataChange?: (val: any) => void;
  onHide?: () => void;
}
const list = [0.1, 0.5, 1];
export default function Mobile({
  show,
  token,
  slipData,
  onSlipDataChange,
  onHide
}: Props) {
  // const [inputData, setInputData] = useState(slipData)

  return (
    <Popup
      visible={show}
      onMaskClick={() => {
        onHide && onHide();
      }}
      onClose={() => {
        onHide && onHide();
      }}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <div className={styles.main}>
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
    </Popup>
  );
}
