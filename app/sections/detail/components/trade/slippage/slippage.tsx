import { Popup } from "antd-mobile";
import styles from "./index.module.css";
import type { Project } from "@/app/type";
import MainBtn from "@/app/components/mainBtn";

interface Props {
  show: boolean;
  token: any;
  slipData?: number;
  onSlipDataChange?: (val: any) => void;
  onHide?: () => void;
}

const list = [0.1, 0.5, 1]

export default function SlipPage({ show, token, slipData, onSlipDataChange, onHide }: Props) {
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
          {
            list.map(item => {
              return <div onClick={() => {
                onSlipDataChange && onSlipDataChange(item)
              }} className={styles.item + ' ' + (slipData === item ? styles.checked : '')}>
                <div className={styles.amount}>{ item }%</div>
                <div className={styles.checkBox}></div>
              </div>
            })
          }
        </div>

        <div className={ styles.inputBox }>
          <input className={ styles.input } placeholder="Custom"/>
          <div className={ styles.percent }>%</div>
        </div>

        <MainBtn>Okay</MainBtn>
      </div>
    </Popup>
  );
}
