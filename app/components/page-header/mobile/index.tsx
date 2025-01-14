import styles from "./index.module.css";
import Menu from "../../menu";
import { useRouter } from 'next/navigation';
export default function PageHeader({
  onBack,
  title,
  theme = "light",
  className,
  from,
  style
}: any) {
  const router = useRouter();

  const handleSetting = () => {
    router.push("/profile/setting");
  };

  return (
    <div className={`${styles.Container} ${className}`} style={style}>
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
      <div
        className={styles.Title}
        style={{
          color: theme === "dark" ? "#000" : "#fff"
        }}
      >
        {title}
      </div>
      <div className={styles.Right}>
        {
          from === "profile" && (
            <button
              type="button"
              className={styles.SettingButton}
              onClick={handleSetting}
            />
          )
        }
        {
          !['setting'].includes(from) && (
            <Menu theme={theme} />
          )
        }
      </div>
    </div>
  );
}
