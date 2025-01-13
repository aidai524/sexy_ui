import PageHeader from "@/app/components/page-header/mobile";
import TotalPanel from "./total-panel";
import EarnAndInvite from "./earn-invite";
import Others from "./others";
import Rank from "./rank";
import styles from "./index.module.css";

export default function Mining({ info, infoLoading }: any) {
  return (
    <div className={styles.Container}>
      <PageHeader title="Reward" />
      <div className={styles.Content}>
        <TotalPanel info={info} />
        <EarnAndInvite info={info} />
        <Others info={info} />
        <Rank info={info} infoLoading={infoLoading} />
      </div>
    </div>
  );
}
