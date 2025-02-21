import React from "react";
import styles from "./index.module.css";
import { RightArrowIcon } from "@/app/sections/trends/components/top-traders/icons";

export default function RightArrowWrap({ props }: any) {
  return (
    <div className={styles.container} {...props}>
      <RightArrowIcon />
    </div>
  );
}
