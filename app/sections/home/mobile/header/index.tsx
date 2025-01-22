import TypesTabs from "@/app/sections/home/tabs";
import MessagesAlarm from "@/app/components/messages";
import Menu from "@/app/components/menu";
import styles from "./index.module.css";
import SearchBar from "@/app/components/search-bar";

export default function Header({ currentTab, onChangeTab }: any) {
  return (
    <div className={styles.Header}>
      <div className={styles.King}>
        <Menu />
      </div>
      <TypesTabs launchIndex={currentTab} setLaunchIndex={onChangeTab} />
      <div className={styles.Actions}>
        <SearchBar />
        <MessagesAlarm />
      </div>
    </div>
  );
}
