import styles from "./index.module.css";
export default function CreateButton({ id }: any) {
  return (
    <button
      id={id}
      onClick={() => {
        history.pushState({ page: "/create" }, "Create", "/create");
      }}
      className={styles.MiningAndCreateButton}
    >
      <img src="/img/tabs/tab3-active.svg" className={styles.CreateIcon} />
      <span>CREATE</span>
    </button>
  );
}
