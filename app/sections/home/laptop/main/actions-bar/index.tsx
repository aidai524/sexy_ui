import TrendsButton from "./trends-button";
import CreateButton from "./create-button";
import LaunchingActions from "@/app/components/action/launching";
import LaunchedActions from "@/app/components/action/launched";
import styles from "./index.module.css";

export default function ActionsBar({ tokenInfo, onLike, onHate }: any) {
  return (
    <div className={styles.Prelaunch}>
      <TrendsButton />
      {tokenInfo &&
        (tokenInfo.status === 0 ? (
          <LaunchingActions
            token={tokenInfo}
            onLike={onLike}
            onHate={onHate}
            onSuperLike={() => {}}
            onBoost={() => {}}
            style={{
              position: "inherit",
              gap: 14
            }}
          />
        ) : (
          <LaunchedActions data={tokenInfo} from="laptop" />
        ))}

      <CreateButton />
    </div>
  );
}
