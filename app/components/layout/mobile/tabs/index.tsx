import styles from "./index.module.css";
import tabs, { tabsPath } from "./config";
import { useRouter, usePathname } from "next/navigation";
export default function Tabs() {
  const pathname = usePathname();
  const router = useRouter();

  if (!tabsPath.includes(pathname)) return null;
  return (
    <div className={styles.Container}>
      {tabs.map((item: any) => {
        const isActive = item.key.includes(pathname);
        return (
          <div
            className={styles.Tab}
            key={item.path}
            onClick={() => {
              if (!window.sexAddress && item.needLogin) {
                window.connect();
                return;
              }

              router.push(item.path);
            }}
          >
            <item.icon
              size={item.iconSize}
              type={isActive ? "primary" : "disabled"}
            />
            <div
              style={{
                color: isActive ? "#FBCA04" : "#9290B1"
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
