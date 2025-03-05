import styles from "./index.module.css";
import config from "@/app/components/menu/config";
import { useRouter, usePathname } from "next/navigation";
import BarIcon from "../bar-icon";
import { motion } from "framer-motion";
import ExpandPanelLinks from "@/app/components/layout/laptop/menu/expand-panel/links";
import CreateIcon from "../create-icon";
import useCanClaim from "@/app/hooks/useCanClaim";

export default function ExpandPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const canClaim = useCanClaim({pathname});
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className={styles.Container}
    >
      <div className={styles.List}>
        {config.map((item: any) => {
          const isActive = item.key.includes(pathname);
          return (
            <div
              className={`${item?.comingSoon ? styles.ComingSoonWrapper : styles.Item} ${isActive && styles.ItemActive}`}
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
                {item?.comingSoon && (
                  <img src="/img/smart/coming-soon.png" alt="coming-soon" className={styles.ComingSoon}/>
                )}
              <span className={styles.ItemIcon}>
                {item.label === "Smart" && canClaim > 0 && (
                  <div className={styles.copyDot}></div>
                )}
             
                <item.icon
                  size={item.iconSize}
                  type={item.key.includes(pathname) ? "primary" : "disabled"}
                />
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.Bottom}>
        <div
          className={`${styles.Create} button`}
          onClick={() => {
            if (!window.sexAddress) {
              window.connect();
              return;
            }
            router.push("/create");
          }}
        >
          <CreateIcon />
          <span>Create</span>
        </div>
        <ExpandPanelLinks />
        {/* <div className={styles.Desc}>
          <span>Flip🫰, Like🩷, and EarN</span>
          <BarIcon />
        </div> */}
      </div>
    </motion.div>
  );
}
