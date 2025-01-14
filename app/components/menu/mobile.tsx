import MenuIcon from "../icons/menu";
import TitleIcon from "../icons/title";
import NIcon from "./n-icon";
import Bar from "../icons/bar";
import config, { Links } from "./config";
import { motion } from "framer-motion";
import styles from "./mobile.module.css";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Mobile({ theme }: any) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const close = () => {
      setShow(false);
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <>
      <button
        className="button"
        onClick={(ev) => {
          console.log(33);
          setShow(true);
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
        }}
      >
        <MenuIcon theme={theme} />
      </button>
      {show && (
        <motion.div
          initial={{
            x: "100%",
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
                key={item.key}
                onClick={() => {
                  if (!window.sexAddress && !["/reward"].includes(item.key)) {
                    window.connect();
                    return;
                  }

                  router.push(item.path);
                }}
                className={`button ${styles.Item}`}
                style={{
                  backgroundColor:
                    pathname === item.path ? "#302F33" : "#252328"
                }}
              >
                {item.icon}{" "}
                <span className={styles.ItemText}>{item.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.Links}>
            {Links.map((link: any) => (
              <a className="button" href={link.href} key={link.icon}>
                <img src={link.icon} />
              </a>
            ))}
          </div>
          <Bar size={148} className={styles.Bar2} />
          <Bar size={158} className={styles.Bar1} />
        </motion.div>
      )}
    </>
  );
}
