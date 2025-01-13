import styles from "./index.module.css";
import Menu from "../../menu";
export default function PageHeader({ title, theme = "light", className }: any) {
  return (
    <div className={`${styles.Container} ${className}`}>
      <button className="button">
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
      <Menu theme={theme} />
    </div>
  );
}
