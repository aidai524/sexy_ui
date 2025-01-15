import styles from "./index.module.css";
import Tabs from "./tabs";

export default function Header({ currentTab, onChangeTab, onClose, num }: any) {
  return (
    <div className={styles.Header}>
      <Tabs currentTab={currentTab} onChangeTab={onChangeTab} num={num} />
    </div>
  );
}
