import Comment from "@/app/components/comment";
import styles from "./index.module.css";
import { useState } from "react";

const BUTTONS = ["Img", "Discussion", "Founders"];
export default function TokenCardActions({ token }: any) {
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
      {currentTab !== "Img" && (
        <div className={styles.Layer}>
          {currentTab === "Discussion" && (
            <Comment
              id={token.id}
              usePanel={false}
              showEdit={false}
              titleStyle={{
                color: "#fff"
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
