import type { Project } from "@/app/type";
import LaunchTag from "../tag/status";
import Import from "../tag/import";
import styles from "./TokenTags.module.css";
import { useMemo } from "react";

interface Props {
  token: Project;
}

export default function TokenTags({ token }: Props) {
  const status = useMemo(() => {
    if (token.initiativeLaunching && token.status === 0) {
      return 1;
    }

    return token.status;
  }, [token]);

  return (
    <div className={styles.tags}>
      <LaunchTag type={status as number} />
      {token.DApp === "pump" && <Import />}
    </div>
  );
}
