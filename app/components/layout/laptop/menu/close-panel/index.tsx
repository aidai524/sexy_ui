import styles from "./index.module.css";
import config, { Links } from "@/app/components/menu/config";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CreateIcon from "../create-icon";
import useCanClaim from "@/app/hooks/useCanClaim";

export default function ExpandPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const canClaim = useCanClaim({pathname});
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
              className={`${item?.comingSoon && styles.ComingSoonWrapper} ${styles.Item} ${isActive && styles.ItemActive}`}
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
              <span className={styles.ItemIcon}>
              {item.label === "Smart" && canClaim > 0 && (
                  <div className={styles.copyDot}></div>
                )}
                {item?.comingSoon && (
                  <img src="/img/smart/coming-soon.png" alt="coming-soon" className={styles.ComingSoon}/>
                )}
                <item.icon
                  size={item.iconSize}
                  type={item.key.includes(pathname) ? "primary" : "disabled"}
                />
              </span>
              <span className={styles.ItemText}>{item.label}</span>
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
        </div>
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
