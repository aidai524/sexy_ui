"use client";

import { memo, useState } from "react";
import { Picker } from "antd-mobile";
import styles from "../edit.module.css";
import options from "./options";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";

export default memo(function Education({
  inputStyle,
  setEducation,
  education
}: any) {
  const { isMobile } = useUserAgent();
  const [showPanel, setShowPanel] = useState(false);

  const onTrigger = async () => {
    if (isMobile) {
      const value = await Picker.prompt({
        columns: [options],
        cancelText: "Cancel",
        confirmText: "Ok",
        // @ts-ignore
        value: [education]
      });

      if (value && value.length > 0) {
        setEducation(value[0] as string);
      } else {
        setEducation("");
      }
    } else {
      setShowPanel(true);
    }
  };
  return (
    <div
      onClick={onTrigger}
      className={styles.picker}
      style={{ ...inputStyle, position: "relative" }}
    >
      {education ? (
        <div className={styles.pickerValue}>{education}</div>
      ) : (
        <div className={styles.pickerTitle}>Select</div>
      )}

      <div>
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.0711 1.07107L8 8.14214L0.928932 1.07107"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
      <Laptop
        open={showPanel}
        onClose={() => {
          setShowPanel(false);
        }}
        onSelect={(option: any) => {
          setEducation(option.value);
          setShowPanel(false);
        }}
      />
    </div>
  );
});
