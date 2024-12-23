import Tab from "@/app/components/tab";
import styles from "./create.module.css";

import CreateNode from "./CreateNode";
import PreviewNode from "./PreviewNode";

import { useState } from "react";
import type { Project } from "@/app/type";

export default function Create() {
  const [renderType, setRenderType] = useState(0);
  const [dataAdd, setDataAdd] = useState<Project>();

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <div className={styles.titleText}>Create Token</div>
        <div className={styles.editProgress}>
          <div
            className={[
              styles.editStep,
              renderType === 0 ? styles.editActive : ""
            ].join(" ")}
          >
            <MiniCircle />
            <span>Edit</span>
          </div>

          <div className={styles.line}></div>

          <div
            className={[
              styles.editStep,
              renderType === 1 ? styles.editActive : ""
            ].join(" ")}
          >
            <MiniCircle />
            <span>Preview</span>
          </div>
        </div>
      </div>

      {
        <CreateNode
          show={renderType === 0}
          onAddDataFill={(value: any) => {
            setDataAdd(value);
            setRenderType(1);
            window.scrollTo(0, 0);
          }}
        />
      }

      {renderType === 1 && (
        <PreviewNode
          show={true}
          data={dataAdd!}
          onAddDataCancel={() => {
            setRenderType(0);
          }}
        />
      )}
    </div>
  );
}

function MiniCircle() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="4" fill="white" />
    </svg>
  );
}
