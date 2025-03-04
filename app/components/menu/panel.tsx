import { AnimatePresence, motion } from "framer-motion";
import styles from "./panel.module.css";
import TitleIcon from "../icons/title";
import NIcon from "./n-icon";
import Bar from "../icons/bar";
import ReactDOM from "react-dom";
import config, { Links } from "./config";
import { useRouter, usePathname } from "next/navigation";
import { useUserAgent } from "@/app/context/user-agent";

export default function Panel({ show }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { innerHeight } = useUserAgent();

  return ReactDOM.createPortal(
    (
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            initial={{
              x: -290,
              opacity: 0
            }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeInOut",
                staggerChildren: 0.3
              }
            }}
            className={styles.Panel}
            style={{
              height: innerHeight,
              width: 290
            }}
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          >
            <div className={styles.Top}>
              <div className={styles.Title}>
                <TitleIcon />
              </div>
              <div className={styles.Desc}>
                <span>Flip🫰, Like🩷, and Ear</span>
                <NIcon />
              </div>
            </div>
            <div className={styles.List}>
              {config.map((item: any) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (!window.sexAddress && item.needLogin) {
                      window.connect();
                      return;
                    }

                    router.push(item.path);
                  }}
                  className={`button ${styles.Item}`}
                  style={{
                    backgroundColor: item.key.includes(pathname)
                      ? "#302F33"
                      : "#252328"
                  }}
                >
                  <item.icon
                    size={item.iconSize}
                    type={item.key.includes(pathname) ? "primary" : "disabled"}
                  />
                  <span className={styles.ItemText}>{item.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.Links}>
              {Links.map((link: any) => (
                <a
                  className="button"
                  href={link.href}
                  target="_blank"
                  key={link.icon}
                >
                  <img src={link.icon} />
                </a>
              ))}
            </div>
            <Bar size={148} className={styles.Bar2} />
            <Bar size={158} className={styles.Bar1} />
          </motion.div>
        )}
      </AnimatePresence>
    ) as any,
    document.getElementById("main-content") || document.body
  );
}
