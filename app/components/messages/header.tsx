import styles from "./index.module.css";
import Tabs from "./tabs";
import Close from "../icons/close";

export default function Header({ currentTab, onChangeTab, onClose, num }: any) {
  return (
    <div className={styles.Header}>
      <Tabs currentTab={currentTab} onChangeTab={onChangeTab} num={num} />
      <button
        className="button"
        onClick={(ev) => {
          ev.stopPropagation();
          onClose();
        }}
      >
        <Close />
      </button>
    </div>
  );
}
