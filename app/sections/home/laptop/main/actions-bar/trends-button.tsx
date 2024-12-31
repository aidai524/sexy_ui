import styles from "./index.module.css";

export default function MiningButton({ id }: any) {
  return (
    <button
      id={id}
      onClick={() => {
        history.pushState({ page: "/trends" }, "Trends", "/trends");
      }}
      className={styles.MiningAndCreateButton}
    >
      <img src="/img/tabs/tab5-active.svg" className={styles.MiningIcon} />
      <span>TRENDS</span>
    </button>
  );
}
