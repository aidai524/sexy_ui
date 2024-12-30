import Back from "@/app/components/back/laptop";
import CreateNode from "../CreateNode";
import PreviewNode from "../PreviewNode";
import { useState, useRef } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/hooks/useUserInfo";
import type { Project } from "@/app/type";
import styles from "./index.module.css";

export default function Laptop() {
  const [renderType, setRenderType] = useState(0);
  const [dataAdd, setDataAdd] = useState<Project>();
  const { address } = useAccount();
  const { userInfo } = useUserInfo(address);
  const createRef = useRef<any>();
  const previewRef = useRef<any>();

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Container}>
        <div className={styles.Header}>
          <div className={styles.BackWrapper}>
            <Back />
          </div>
          <div>
            <div className={styles.Title}>Create Token</div>
            {userInfo?.name && (
              <div className={styles.Create}>
                <span>Created by:</span>
                <span
                  style={{
                    color: "#55FFF4"
                  }}
                >
                  {userInfo?.name}
                </span>
              </div>
            )}
          </div>
          <div className={styles.Buttons}>
            {renderType === 1 ? (
              <></>
            ) : (
              <button
                onClick={() => {
                  createRef.current?.onPreview();
                }}
                className={styles.Button}
              >
                Preview
              </button>
            )}
          </div>
        </div>
        <div
          className={styles.Content}
          style={{
            height:
              renderType === 0 ? "calc(100vh - 180px)" : "calc(100vh - 260px)"
          }}
        >
          <CreateNode
            show={renderType === 0}
            onAddDataFill={(value: any) => {
              setDataAdd(value);
              setRenderType(1);
              window.scrollTo(0, 0);
            }}
            ref={createRef}
          />
          {renderType === 1 && (
            <PreviewNode
              show={true}
              data={dataAdd!}
              onAddDataCancel={() => {
                setRenderType(0);
              }}
              ref={previewRef}
            />
          )}
        </div>
      </div>
      {renderType === 1 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            justifyContent: "center"
          }}
        >
          <button
            onClick={() => {
              previewRef.current?.onEdit();
            }}
            className={styles.Button}
            style={{
              width: 174,
              height: 60
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              previewRef.current?.onCreate();
            }}
            className={styles.Button}
            style={{
              background: "#C9FF5D",
              borderColor: "#C9FF5D",
              color: "#000",
              width: 174,
              height: 60
            }}
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
}
