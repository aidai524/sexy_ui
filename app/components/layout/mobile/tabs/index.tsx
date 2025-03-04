import styles from "./index.module.css";
import tabs, { tabsPath } from "./config";
import { useRouter, usePathname } from "next/navigation";
import useCanClaim from "@/app/hooks/useCanClaim";

export default function Tabs() {
  const pathname = usePathname();
  const router = useRouter();
  const canClaim = useCanClaim({pathname});

  if (pathname === "/create") {
    return null;
  }

  if (!tabsPath.includes(pathname)) return null;

  return (
    <div className={styles.Container}>
      {tabs.map((item: any) => {
        const isActive = item.key.includes(pathname);
        return (
          <div
            className={`${item?.comingSoon && styles.ComingSoonWrapper} ${styles.Tab}`}
            key={item.path}
            onClick={() => {
              if (!window.sexAddress && item.needLogin) {
                window.connect();
                return;
              }
              if (item?.comingSoon) {
                return;
              }
              router.push(item.path);
            }}
          >
            {item.label === "Smart" && canClaim > 0 && (
              <div className={styles.copyDot}></div>
            )}
            {item?.comingSoon && (
              <img src="/img/smart/coming-soon.png" alt="coming-soon" className={styles.ComingSoon}/>
            )}
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
