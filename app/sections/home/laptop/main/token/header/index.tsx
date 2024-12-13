import { Avatar } from "@/app/components/thumbnail";
import Tabs from "../tabs";
import ShareIcon from "@/app/components/icons/share";
import ZoomOutIcon from "@/app/components/icons/zoom-out";
import styles from "./index.module.css";

export default function Header({ tokenInfo, currentTab, setCurrentTab }: any) {
  return (
    <div className={styles.Container}>
      {tokenInfo ? <Avatar data={tokenInfo} /> : <div />}
      <div className={styles.Actions}>
        <Tabs currentTab={currentTab} onChangeTab={setCurrentTab} />
        <div className={styles.Buttons}>
          <button className="button">
            <ShareIcon />
          </button>
          <button className="button">
            <ZoomOutIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
