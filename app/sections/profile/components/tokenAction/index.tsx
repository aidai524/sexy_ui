import styles from "./index.module.css";
import type { Project } from "@/app/type";
import ActionList from "./actionList";
import Big from 'big.js';

interface Props {
  token: Project;
  isDelay: boolean;
  isOther: boolean;
  prepaidWithdrawDelayTime: number;
  prepaidRealAmount: Big.Big;
  prepaidAmount: Big.Big;
  smookeable: false | 1 | 2;
  showWithdraw: boolean;
  isPrepaid: boolean;
  prepaidSolWithdraw: any;
  prepaidTokenWithdraw: any;
  tokenAmount: Big.Big;
  onWithdrawSuccess?(): void;
}

export default function TokenAction(props: Props) {
  return (
    <div
      className={styles.main}
      style={{
        position: "relative"
      }}
    >
      <ActionList
        {...props}
      />
    </div>
  );
}
