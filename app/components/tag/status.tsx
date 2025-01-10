import styles from "./status.module.css";

export default function LaunchTag({ type }: { type: number }) {
  if (type === 0) {
    return (
      <div className={styles.launchTag + " " + styles.launch1}>Pre-Launch</div>
    );
  }

  if (type === 1) {
    return (
      <div className={styles.launchTag + " " + styles.launch2}>Launching</div>
    );
  }

  if (type === 3) {
    return (
      <div className={styles.launchTag + " " + styles.launch3}>Launched</div>
    );
  }
}
