import type { Project } from "@/app/type";
import LaunchTag from "../tag/status";
import Import from "../tag/import";
import Paid from "../tag/Paid";
import styles from './TokenTags.module.css';

interface Props {
  token: Project;
}

export default function TokenTags({ token }: Props) {
  return (
    <div className={styles.tags}>
      <LaunchTag type={token.status as number} />
      {token.DApp === 'pump' && <Import />}
      {Number(token.prePaidAmount) > 0 && <Paid />}
    </div>
  );
} 