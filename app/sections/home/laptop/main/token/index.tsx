import ActionsBar from "../actions-bar/prelaunch";
import styles from "./index.module.css";

export default function Token() {
  return (
    <>
      <div className={styles.Container}></div>
      <ActionsBar />
    </>
  );
}
