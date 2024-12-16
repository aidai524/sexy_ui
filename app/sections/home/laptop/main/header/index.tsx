import Tabs from "../../../tabs";
import ConnectButton from "@/app/components/connectButton";
import AlarmIcon from "@/app/components/icons/alarm";
import Badge from "@/app/components/badge";
import Messages from "@/app/components/messages/popover";
import styles from "./index.module.css";

export default function Header({ tab, setTab, userInfo }: any) {
  return (
    <div className={styles.Container}>
      <Tabs launchIndex={tab} setLaunchIndex={setTab} />
      <div className={styles.Actions}>
        <ConnectButton userInfo={userInfo} />
        <Badge>
          <div className={`button ${styles.Alarm}`}>
            <AlarmIcon />
          </div>
        </Badge>
      </div>
      <Messages
        style={{
          top: 80
        }}
      />
    </div>
  );
}
