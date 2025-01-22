import styles from "./index.module.css";
import config, { Links } from "@/app/components/menu/config";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ExpandPanel() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <motion.div
      className={styles.Container}
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
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
              <span className={styles.ItemText}>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.Bottom}>
        <div className={styles.Links}>
          {Links.map((link: any) => (
            <a
              className="button"
              href={link.href}
              target="_blank"
              key={link.icon}
            >
              <img src={link.icon} className={styles.LinkIcon} />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
