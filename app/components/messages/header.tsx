import styles from "./index.module.css";
import Tabs from "./tabs";
import Close from "../icons/close";

export default function Header({ currentTab, onChangeTab }: any) {
  return (
    <div className={styles.Header}>
      <Tabs currentTab={currentTab} onChangeTab={onChangeTab} />
      <button className="button">
        <Close />
      </button>
    </div>
  );
}
