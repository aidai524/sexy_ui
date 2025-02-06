import CreateNode from "../CreateNode";
import PreviewNode from "./preview";
import Actions from "./actions";
import CreateModal from "@/app/sections/create/components/create";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { fail } from "@/app/utils/toast";
import { httpAuthPost, sleep } from "@/app/utils";
import type { Project } from "@/app/type";
import styles from "./index.module.css";

export default function Laptop() {
  const [step, setStep] = useState("edit");
  const [dataAdd, setDataAdd] = useState<Project>();
  const createRef = useRef<any>();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.Wrapper}
      >
        <div className={styles.TitleWrapper}>Create token</div>
        <div className={styles.Container}>
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
              }}
            />
          </motion.div>
          {step === "preview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              setStep("edit");
              return;
            }
            if (type === "create") {
              setShowCreateModal(true);
              return;
            }
          }}
        />
      </motion.div>
      {dataAdd && (
        <CreateModal
          show={showCreateModal}
          token={{
            tokenName: dataAdd.tokenName,
            tokenSymbol: dataAdd.tokenSymbol,
            tokenDecimals: 6,
            tokenUri: dataAdd.tokenIcon || dataAdd.tokenImg
          }}
          data={dataAdd}
          onHide={() => {
            setShowCreateModal(false);
          }}
          onCreateTokenSuccess={async () => {
            const query: any = {
              about_us: dataAdd.about,
              discord: dataAdd.discord,
              icon: dataAdd.tokenIcon,
              tg: dataAdd.tg,
              ticker: dataAdd.ticker,
              token_name: dataAdd.tokenName,
              token_symbol: dataAdd.tokenSymbol,
              video: dataAdd.tokenImg,
              website: dataAdd.website,
              x: dataAdd.x
            };

            const queryStr = Object.keys(query)
              .map((key) => `${key}=${encodeURIComponent(query[key])}`)
              .join("&");

            let times = 0,
              val;
            while (true && times < 50) {
              val = await httpAuthPost(`/project?${queryStr}`, {});
              if (val.code === 100000) {
                times++;
                await sleep(5000);
              } else {
                break;
              }
            }

            if (val.code === 0) {
              return true;
            } else {
              fail("Create token fail");
              return false;
            }
          }}
        />
      )}
    </>
  );
}
