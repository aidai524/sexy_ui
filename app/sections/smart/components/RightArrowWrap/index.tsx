import React from "react";
import styles from "./index.module.css";
import { RightArrowIcon } from "@/app/sections/trends/components/top-traders/icons";

export default function RightArrowWrap({ useLinear }: { useLinear?: boolean }) {
  return (
    <div className={`
      ${styles.container}
      ${useLinear && styles.linearContainer}
    `.trim()}>
      <RightArrowIcon />
    </div>
  );
}
