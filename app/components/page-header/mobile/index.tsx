import styles from "./index.module.css";
import SimpleAvatar from "../../avatar/simple";
import MessagesAlarm from "@/app/components/messages";
import SearchBar from "@/app/components/search-bar";
import Tips from "./tips";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import clsx from 'clsx';

export default function PageHeader({
  onBack,
  title,
  theme = "light",
  className,
  from,
  style,
  isOther,
  rightActions,
  backButtonClassName
}: any) {
  const { userInfo } = useAuth();
  const router = useRouter();
  return (
    <div className={`${styles.Container} ${className}`} style={style}>
      {from === "profile" && <></>}
      {(isOther || ["setting", "create", "messages", "profile"].includes(from)) && (
        <button
          className={clsx('button', backButtonClassName)}
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
      {["trends", "reward", "home", "smart", "memes"].includes(from) && (
        <SimpleAvatar
          icon={userInfo?.icon}
          onClick={() => {
            router.push("/profile");
          }}
        />
      )}
      {["trends", "reward", "home", "smart", "memes"].includes(from) && <Tips />}
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

      {rightActions ? (
        <div className={styles.Right}>{rightActions}</div>
      ) : (
        ["home", "reward", "smart", "memes"].includes(from) && (
          <div className={styles.Right}>
            <SearchBar />
            <MessagesAlarm />
          </div>
        )
      )}
      {from === "create" && <div />}
    </div>
  );
}
