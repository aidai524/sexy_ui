import MenuIcon from "../icons/menu";
import TitleIcon from "../icons/title";
import NIcon from "./n-icon";
import Bar from "../icons/bar";
import config, { Links } from "./config";
import styles from "./mobile.module.css";
import { useState, useEffect } from "react";

export default function Mobile() {
  const [show, setShow] = useState(false);

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
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
          setShow(true);
        }}
      >
        <MenuIcon />
      </button>
      <div
        className={styles.Panel}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
        style={{
          transform: `translateX(${show ? "0px" : "100%"})`
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
            <button key={item.key} className={`button ${styles.Item}`}>
              {item.icon} <span className={styles.ItemText}>{item.label}</span>
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
      </div>
    </>
  );
}
