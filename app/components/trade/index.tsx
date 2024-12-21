import { useState } from "react";
import styles from "./trande.module.css";
import BuySell from "./buySell";
import type { Project } from "@/app/type";

interface Props {
  token: Project;
  initType?: string;
  from?: string;
}

export default function Trade({ token, initType = "buy", from }: Props) {
  return (
    <div className={styles.main}>
      <BuySell token={token} initType={initType} from={from} />
    </div>
  );
}
