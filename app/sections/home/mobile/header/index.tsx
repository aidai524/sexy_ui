import TypesTabs from "@/app/sections/home/tabs";
import MessagesAlarm from "@/app/components/messages";
import Menu from "@/app/components/menu";
import King from "@/app/sections/trends/components/king-mobile";
import styles from "./index.module.css";
export default function Header({ currentTab, onChangeTab }: any) {
  return (
    <div className={styles.Header}>
      <div className={styles.King}>
        <King />
      </div>
      <TypesTabs launchIndex={currentTab} setLaunchIndex={onChangeTab} />
      <div className={styles.Actions}>
        <MessagesAlarm />
        <Menu />
      </div>
    </div>
  );
}
