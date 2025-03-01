import styles from "./index.module.css";
import Modal from "../../modal";
import { Switch } from "antd-mobile";
import { useSetting } from "@/app/store/use-setting";
import { useUserAgent } from "@/app/context/user-agent";

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
  const { isMobile } = useUserAgent();

  const settingStore: any = useSetting();
  return (
    <Modal
      open={show}
      style={{
        zIndex: 99999,
        width: isMobile ? "100%" : "auto",
      }}
      onClose={() => {
        onHide && onHide();
      }}
      animation={isMobile ? "popup" : "modal"}
      forceNoCloseIcon={isMobile}
    >
      <div className={styles.main + " " + (isMobile ? styles.mobile : styles.pc)}>
        <div
          className={styles.title}
          onClick={() => {
            isMobile && onHide?.();
          }}
        >
          {
            isMobile && <svg
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 14L2 7.5L8 1"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          }
          <div className={styles.tip}>Slippage tolerance</div>
        </div>
        <div className={styles.list}>
          {list.map((item) => {
            return (
              <div
                key={item}
                onClick={() => {
                  onSlipDataChange && onSlipDataChange(item);
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
        <div className={styles.ProtectionWrapper}>
          <div className={styles.ProtectionItem}>
            <div style={{ width: 180 }}>Enable front-running protection:</div>
            <div className={styles.ProtectionAction}>
              <span>On</span>
              <Switch
                checked={settingStore.jitoable}
                style={{
                  "--checked-color": "#FBCA04",
                  "--height": "20px",
                  "--width": "36px"
                }}
                onChange={(val) => {
                  settingStore.set({
                    jitoable: val
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.ProtectionDesc}>
            Front-running protection decreases the chances of bots from front-running your buys. You can use high slippage with front-running protection turned on. We recommend setting a tip amount of at least 0.01 SOL with front-running protection enabled.

          </div>
        </div>
      </div>
    </Modal>
  );
}
