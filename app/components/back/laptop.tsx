import styles from "./laptop.module.css";
export default function GoBack() {
  return (
    <button className={styles.Container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="17"
        viewBox="0 0 10 17"
        fill="none"
      >
        <path
          d="M8.14262 15.2852L1 8.14258L8.14262 0.99996"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.Text}>Back</span>
    </button>
  );
}
