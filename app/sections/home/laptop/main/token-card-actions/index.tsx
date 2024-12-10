import styles from "./index.module.css";
import { useState } from "react";

const BUTTONS = ["Img", "Discussion", "Founders"];
export default function TokenCardActions() {
  const [currentTab, setCurrentTab] = useState("Img");
  return (
    <>
      <div className={styles.Container}>
        {BUTTONS.map((button: string) => (
          <button
            key={button}
            className={`${styles.Button} ${
              currentTab === button && styles.ButtonActive
            } button`}
            onClick={() => {
              setCurrentTab(button);
            }}
          >
            {button}
          </button>
        ))}
      </div>
      {currentTab !== "Img" && <div className={styles.Layer}></div>}
    </>
  );
}
