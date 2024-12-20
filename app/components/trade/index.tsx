import { useState } from "react";
import styles from "./trande.module.css";
import BuySell from "./buySell";

interface Props {
  token: {
    tokenName: string;
    tokenSymbol: string;
    tokenUri: string;
    tokenDecimals: number;
  };
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
