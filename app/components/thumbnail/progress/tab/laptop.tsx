import styles from "./laptop.module.css";

export default function Tab({ onClick, isActive, text }: any) {
  return (
    <button
      className={`${styles.Button} ${isActive && styles.ButtonActive} button`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
