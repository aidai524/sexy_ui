import styles from "./index.module.css";
import config from "@/app/components/menu/config";
import { useRouter, usePathname } from "next/navigation";
import BarIcon from "../bar-icon";
import { motion } from "framer-motion";
import ExpandPanelLinks from '@/app/components/layout/laptop/menu/expand-panel/links';

export default function ExpandPanel() {
  const pathname = usePathname();
  const router = useRouter();
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
              className={`${styles.Item} ${isActive && styles.ItemActive}`}
              key={item.path}
              onClick={() => {
                if (!window.sexAddress && item.needLogin) {
                  window.connect();
                  return;
                }

                router.push(item.path);
              }}
            >
              <span className={styles.ItemIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.Bottom}>
        <ExpandPanelLinks />
        <div className={styles.Desc}>
          <span>Flip🫰, Like🩷, and EarN</span>
          <BarIcon />
        </div>
      </div>
    </motion.div>
  );
}
