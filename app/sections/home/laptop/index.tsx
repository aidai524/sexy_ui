import TypesTabs from "@/app/sections/home/mobile/tabs";
import List from "./list";
import TrendBanner from "../../trends/components/banner";
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
      <div className={styles.TrendBanner}>
        <TrendBanner />
      </div>
      <div className={styles.Content}>
        <List
          type="preLaunch"
          onChangeTab={(tab: number) => {
            homeTabStore.set({ homeTabIndex: tab });
          }}
          isCurrentTab={homeTabStore.homeTabIndex === 0}
        />
        <List
          type="launching"
          onChangeTab={(tab: number) => {
            homeTabStore.set({ homeTabIndex: tab });
          }}
          isCurrentTab={homeTabStore.homeTabIndex === 1}
        />
      </div>
    </div>
  );
}
