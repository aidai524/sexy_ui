import Comment from "@/app/components/comment";
import AvatarBox from "@/app/components/thumbnail/avatar-box";
import PreUser from "@/app/components/thumbnail/preUser";
import Holder from "@/app/components/holder";
import styles from "./index.module.css";
import { useState } from "react";

const BUTTONS = ["Img", "Discussion", "Founders"];
export default function TokenCardActions({ token, height }: any) {
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
        <div className={styles.Layer} style={{ height: height || "100%" }}>
          <div className={styles.AvatarBox}>
            <AvatarBox data={token} showLaunchType={true} />
          </div>
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
          {currentTab === "Founders" &&
            (token.status === 0 ? <PreUser token={token} /> : <Holder />)}
        </div>
      )}
    </>
  );
}
