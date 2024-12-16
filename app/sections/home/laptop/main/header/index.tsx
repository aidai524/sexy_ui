import Tabs from "../../../tabs";
import { useRouter } from "next/navigation";
import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";

export default function Header({ tab, userInfo }: any) {
  const router = useRouter();

  return (
    <div className={styles.Container}>
      <Tabs
        launchIndex={tab}
        setLaunchIndex={(launchType: any) => {
          router.push("/?launchType=" + launchType);
        }}
      />
      <div className={styles.Actions}>
        <ConnectButton userInfo={userInfo} />
        <Messages />
      </div>
    </div>
  );
}
