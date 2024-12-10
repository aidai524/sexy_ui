import { Avatar } from "@/app/components/thumbnail";
import Tabs from "../tabs";
import ShareIcon from "@/app/components/icons/share";
import ZoomOutIcon from "@/app/components/icons/zoom-out";
import styles from "./index.module.css";
import { useState } from "react";

export default function Header({ tokenInfo }: any) {
  const [currentTab, setCurrentTab] = useState("info");
  return (
    <div className={styles.Container}>
      <Avatar data={tokenInfo} />
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
