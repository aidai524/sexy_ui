import styles from "./index.module.css";

export default function Tabs({ launchIndex, setLaunchIndex }: any) {
  return (
    <div className={styles.launchPadTab}>
      <div
        onClick={() => {
          setLaunchIndex(0);
        }}
        className={[
          styles.launchPadTabTitle,
          launchIndex === 0 ? styles.launchPadTabTitleActive : ""
        ].join(" ")}
      >
        Pre-Launch
      </div>
      <div
        onClick={() => {
          setLaunchIndex(1);
        }}
        className={[
          styles.launchPadTabTitle,
          launchIndex === 1 ? styles.launchPadTabTitleActive : ""
        ].join(" ")}
      >
        Launching/ed
      </div>
    </div>
  );
}
