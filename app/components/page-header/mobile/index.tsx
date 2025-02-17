import styles from "./index.module.css";
import SimpleAvatar from "../../avatar/simple";
import MessagesAlarm from "@/app/components/messages";
import SearchBar from "@/app/components/search-bar";
import Tips from "./tips";
import { useAuth } from "@/app/context/auth";

export default function PageHeader({
  onBack,
  title,
  theme = "light",
  className,
  from,
  style,
  isOther
}: any) {
  const { userInfo } = useAuth();
  return (
    <div className={`${styles.Container} ${className}`} style={style}>
      {(isOther || ["setting", "create", "messages"].includes(from)) && (
        <button
          className="button"
          onClick={() => {
            if (typeof onBack === "function") {
              onBack();
              return;
            }
            if (from === "detail") {
              history.pushState({ page: "/" }, "Home", `/`);
              return;
            }
            history.back();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="15"
            viewBox="0 0 9 15"
            fill="none"
          >
            <path
              d="M7.5 14L1.5 7.5L7.5 1"
              stroke={theme === "dark" ? "#000" : "#fff"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
      {["trends", "reward", "home", "smart"].includes(from) && (
        <SimpleAvatar icon={userInfo?.icon} />
      )}
      {["trends", "reward", "home", "smart"].includes(from) && <Tips />}
      {["setting", "create", "messages"].includes(from) && (
        <div
          className={styles.Title}
          style={{
            color: theme === "dark" ? "#000" : "#fff"
          }}
        >
          <span>{title}</span>
        </div>
      )}
      {["home", "reward", "smart"].includes(from) && (
        <div className={styles.Right}>
          <SearchBar />
          <MessagesAlarm />
        </div>
      )}
    </div>
  );
}
