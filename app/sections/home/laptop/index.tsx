import TypesTabs from "@/app/sections/home/tabs";
import { useHomeTab } from "@/app/store/useHomeTab";
import styles from "./index.module.css";

export default function Laptop() {
  const homeTabStore: any = useHomeTab();
  return (
    <div className={styles.Container}>
      <div className={styles.TabsWrapper}>
        <TypesTabs
          launchIndex={homeTabStore.homeTabIndex}
          setLaunchIndex={(tab: number) => {
            homeTabStore.set({ homeTabIndex: tab });
          }}
        />
      </div>
    </div>
  );
}
