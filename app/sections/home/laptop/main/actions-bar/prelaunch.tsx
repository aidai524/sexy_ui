import MiningButton from "./mining-button";
import CreateButton from "./create-button";
import Actions from "@/app/components/action";
import styles from "./index.module.css";

export default function PreLaunchBar({ infoData2 }: any) {
  return (
    <div className={styles.Prelaunch}>
      <MiningButton />
      <Actions
        token={infoData2}
        onLike={async () => {
          // like();
        }}
        onHate={async () => {
          // hate();
        }}
        onSuperLike={() => {}}
        onBoost={() => {}}
      />
      <CreateButton />
    </div>
  );
}
