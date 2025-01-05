import { useAuth } from "@/app/context/auth";
import styles from "./index.module.css";
export default function CreateButton({ id }: any) {
  const { userInfo } = useAuth();
  return (
    <button
      id={id}
      onClick={() => {
        if (userInfo?.address) {
          // @ts-ignore
          window?.connect();
          return;
        }
        history.pushState({ page: "/create" }, "Create", "/create");
      }}
      className={styles.MiningAndCreateButton}
    >
      <img src="/img/tabs/tab3-active.svg" className={styles.CreateIcon} />
      <span>CREATE</span>
    </button>
  );
}
