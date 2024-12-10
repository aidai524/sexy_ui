import Tabs from "../../../tabs";
import ConnectButton from "@/app/components/connectButton";
import AlarmIcon from "@/app/components/icons/alarm";
import styles from "./index.module.css";

export default function Header({ tab, setTab, userInfo }: any) {
  return (
    <div className={styles.Container}>
      <Tabs launchIndex={tab} setLaunchIndex={setTab} />
      <div className={styles.Actions}>
        <ConnectButton userInfo={userInfo} />
        <div className={styles.AlarmContainer}>
          <AlarmIcon />
          <div className={styles.Badge} />
        </div>
      </div>
    </div>
  );
}
