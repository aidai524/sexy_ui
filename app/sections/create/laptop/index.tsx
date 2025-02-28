import CreateNode from "../CreateNode";
// import PreviewNode from "./preview";
import { motion } from "framer-motion";
import { useState, useRef, useMemo } from "react";
import { fail } from "@/app/utils/toast";
import { httpAuthPost, sleep } from "@/app/utils";
import type { Project } from "@/app/type";
import styles from "./index.module.css";
import Steps from "./step";
import PreviewNode from "../PreviewNode";
import { useUserAgent } from "@/app/context/user-agent";

export default function Laptop() {
  const [step, setStep] = useState(1);
  const [dataAdd, setDataAdd] = useState<Project>();
  const createRef = useRef<any>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isMobile } = useUserAgent();

  const query = useMemo(() => {
    const query: any = {
      about_us: dataAdd?.about,
      discord: dataAdd?.discord,
      icon: dataAdd?.tokenIcon,
      tg: dataAdd?.tg,
      ticker: dataAdd?.ticker,
      token_name: dataAdd?.tokenName,
      token_symbol: dataAdd?.tokenSymbol,
      video: dataAdd?.tokenImg,
      website: dataAdd?.website,
      x: dataAdd?.x
    };

    const queryStr = Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join("&");

    return queryStr;
  }, [dataAdd]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.Wrapper}
      >
        <Steps step={step} />
        <div className={styles.Container}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.EditWrapper}
          >
            <CreateNode
                ref={createRef}
                step={step}
                // @ts-ignore
                show={step === 1}
                onNext={() => {
                  setStep(step + 1);
                }}
                onBack={() => {
                  setStep(step - 1);
                }}
                onAddDataFill={(value: any) => {
                  setDataAdd(value);
                  setStep(2);
                  window.scrollTo(0, 0);
                }}
              />
            
          </motion.div>
          { step >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PreviewNode
                show={true}
                step={step}
                data={dataAdd!}
                onNext={() => {
                  setStep(step + 1);
                }}
                onBack={() => {
                  setStep(step - 1);
                }} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
