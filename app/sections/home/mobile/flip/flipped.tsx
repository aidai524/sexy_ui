import styles from "./flipped.module.css";
import { numberFormatter } from "@/app/utils/common";
import FlippedIcon from "./flipped-icon";

export default function Flipped({ token }: any) {
  return (
    <div className={styles.Container}>
      <FlippedIcon />
      <div>
        <div className={styles.Label}>You’ve Flipped </div>
        <div className={styles.Desc}>
          {token?.total_amount
            ? numberFormatter(token.total_amount, 3, true, { isShort: true })
            : "0"}{" "}
          SOL of ${token?.tokenName}
        </div>
      </div>
    </div>
  );
}
