import styles from "./mobile.module.css";

export default function Tab({ onClick, isActive }: any) {
  return (
    <div
      onClick={onClick}
      className={[
        styles.progressItem,
        isActive ? styles.progressItemActive : ""
      ].join(" ")}
    />
  );
}
