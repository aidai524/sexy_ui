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
            tabIndex={i}
            isCurrentTab={homeTabStore.homeTabIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
