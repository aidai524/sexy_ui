import TrendsButton from "./trends-button";
import CreateButton from "./create-button";
import LaunchingActions from "@/app/components/action/launching";
import LaunchedActions from "@/app/components/action/launched";
import styles from "./index.module.css";

export default function ActionsBar({
  tokenInfo,
  onLike,
  onHate,
  onSuperLike,
  onBoost
}: any) {
  return (
    <div className={styles.Prelaunch}>
      <TrendsButton id="guid-home-trends" />
      {tokenInfo &&
        (tokenInfo.status === 0 ? (
          <LaunchingActions
            token={tokenInfo}
            onLike={onLike}
            onHate={onHate}
            onSuperLike={onSuperLike}
            canFlip={false}
            onBoost={() => {
              onBoost();
            }}
            style={{
              position: "inherit",
              gap: 14
            }}
            ids={{
              dislike: "guid-home-dislike",
              like: "guid-home-like",
              boost: "guid-home-boost",
              smoke: "guid-home-smoke"
            }}
          />
        ) : (
          <LaunchedActions data={tokenInfo} from="laptop" />
        ))}

      <CreateButton id="guid-home-create" />
    </div>
  );
}
