import styles from "./panel.module.css";

export default function Panel({
  children,
  theme
}: {
  children?: React.ReactNode;
  theme?: string;
}) {
  return (
    <div
      className={`${styles.panel} ${
        theme === "dark" ? styles.Dark : styles.Light
      }`}
    >
      {children}
    </div>
  );
}
