import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";
import TrendBanner from '@/app/sections/trends/components/banner';

export default function Header({ tab, userInfo }: any) {
  return (
    <div className={styles.Container}>
      <TrendBanner />
      <div className={styles.Actions}>
        <ConnectButton userInfo={userInfo} />
        <Messages />
      </div>
    </div>
  );
}
