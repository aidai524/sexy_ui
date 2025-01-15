import styles from "./index.module.css";
import TitleIcon from "./title-icon";
import MenuIcon from "./menu-icon";
import ExpandPanel from "./expand-panel";
import ClosePanel from "./close-panel";
import { useSetting } from "@/app/store/use-setting";

export default function Menu() {
  const settingStore: any = useSetting();
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <button
          className={styles.MenuButton}
          onClick={() => {
            settingStore.set({
              menuExpand: !settingStore.menuExpand
            });
          }}
        >
          <MenuIcon />
        </button>
        <TitleIcon />
      </div>
      {settingStore.menuExpand ? <ExpandPanel /> : <ClosePanel />}
    </div>
  );
}
