import styles from "./create.module.css";

import CreateNode from "./CreateNode";
import PreviewNode from "./PreviewNode";

import { useState } from "react";
import type { Project } from "@/app/type";
import { ProgressBar } from "antd-mobile";
import StepInfo from "./components/StepInfo/index";
import { useRouter } from "next/navigation";

const stepTitles = {
  1: 'Token info',
  2: 'Personalization',
  3: 'Preview',
  4: 'Get Your Share',
}

const stepOptional = {
  1: false,
  2: true,
  3: false,
  4: true,
}

export default function Create() {
  const [renderType, setRenderType] = useState(0);
  const [dataAdd, setDataAdd] = useState<Project>();
  const [step, setStep] = useState(1);
  const router = useRouter();

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        {
          step > 1 && <div className={styles.backIcon} onClick={() => {
            setStep(step - 1);
          }}>
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 14L1.5 7.5L7.5 1" stroke="white" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        }

        <div className={styles.titleText}>Create Token</div>

        <div className={styles.titleIcon} onClick={() => {
          router.back()
        }}>
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.06749 0.792816C0.749618 0.335139 1.3057 -0.220946 1.76338 0.0969242L7.68534 4.2099C7.85684 4.32901 8.08429 4.32901 8.25578 4.20991L14.1777 0.0969249C14.6354 -0.220945 15.1915 0.335138 14.8736 0.792814L10.7607 6.71478C10.6415 6.88627 10.6415 7.11373 10.7607 7.28522L14.8736 13.2072C15.1915 13.6649 14.6354 14.2209 14.1777 13.9031L8.25578 9.7901C8.08429 9.67099 7.85684 9.67099 7.68534 9.79009L1.76338 13.9031C1.3057 14.2209 0.749617 13.6649 1.06749 13.2072L5.18047 7.28522C5.29958 7.11373 5.29958 6.88627 5.18047 6.71478L1.06749 0.792816Z" fill="#9290B1" />
          </svg>
        </div>
      </div>

      <ProgressBar
        percent={step * 25}
        rounded={false}
        style={{
          "--track-width": "4px",
          "--fill-color": "#fff",
          "--track-color": "rgba(255, 255, 255, .3)"
        }}
      />

      <StepInfo
        number={step}
        title={stepTitles[step as keyof typeof stepTitles]}
        optional={stepOptional[step as keyof typeof stepOptional]}
      />

      <CreateNode
        step={step}
        onNext={() => {
          setStep(step + 1);
        }}
        onBack={() => {
          setStep(step - 1);
        }}
        onAddDataFill={(value: any) => {
          setDataAdd(value);
          window.scrollTo(0, 0);
        }}
      />

      {
        step > 2 && <PreviewNode
          show={true}
          step={step}
          data={dataAdd!}
          onNext={() => {
            setStep(step + 1);
          }}
          onBack={() => {
            setStep(step - 1);
          }}
        />
      }
    </div>
  );
}
