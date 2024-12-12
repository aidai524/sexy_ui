import MiningButton from "./mining-button";
import CreateButton from "./create-button";
import Actions from "@/app/components/action/launching";
import styles from "./index.module.css";

export default function PreLaunchBar({ tokenInfo, onLike, onHate }: any) {
  return (
    <div className={styles.Prelaunch}>
      <MiningButton />
      <Actions
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
      <CreateButton />
    </div>
  );
}
