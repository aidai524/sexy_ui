import Tabs from "../../../tabs";
import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";

export default function Header({ tab, setTab, userInfo }: any) {
  return (
    <div className={styles.Container}>
      <Tabs launchIndex={tab} setLaunchIndex={setTab} />
      <div className={styles.Actions}>
        <ConnectButton userInfo={userInfo} />
        <Messages />
      </div>
    </div>
  );
}
