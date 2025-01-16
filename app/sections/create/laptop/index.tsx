import CreateNode from "../CreateNode";
import PreviewNode from "./preview";
import Actions from "./actions";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useUser } from "@/app/store/useUser";
import type { Project } from "@/app/type";
import styles from "./index.module.css";

export default function Laptop() {
  const [step, setStep] = useState("edit");
  const [dataAdd, setDataAdd] = useState<Project>();
  const { userInfo }: any = useUser();
  const createRef = useRef<any>();
  const previewRef = useRef<any>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Wrapper}
    >
      <div className={styles.TitleWrapper}>Create token</div>
      <div className={styles.Container}>
        {step === "edit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.EditWrapper}
          >
            <CreateNode
              ref={createRef}
              show={step === "edit"}
              onAddDataFill={(value: any) => {
                setDataAdd(value);
                setStep("preview");
                window.scrollTo(0, 0);
                console.log("value", value);
              }}
            />
          </motion.div>
        )}
        {step === "preview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.PreviewWrapper}
          >
            <PreviewNode token={dataAdd} />
          </motion.div>
        )}
      </div>
      <Actions
        step={step}
        onClick={(type: string) => {
          if (type === "preview") {
            createRef.current.onPreview();
            return;
          }
          if (type === "edit") {
            return;
          }
          if (type === "create") {
            return;
          }
        }}
      />
    </motion.div>
  );
}
