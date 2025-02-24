import Header from "./header";
import List from "./list";
import { useHomeTab } from "@/app/store/useHomeTab";
import { LaunchType } from "@/app/store/use-projects-new";
import styles from "./index.module.css";

export default function Laptop() {
  const homeTabStore: any = useHomeTab();

  return (
    <div className={styles.Container}>
      <Header />

      <div className={styles.Content}>
        {Object.keys(LaunchType).map((item, i) => (
          <List
            type={item}
            key={i}
            onChangeTab={(tab: number) => {
              let _tab = tab;
              if (tab < 0) _tab = 0;
              const len = Object.keys(LaunchType).length;
              if (tab > len - 1) _tab = len - 1;
              homeTabStore.set({ homeTabIndex: _tab });
            }}
            tabIndex={i}
            isCurrentTab={homeTabStore.homeTabIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
