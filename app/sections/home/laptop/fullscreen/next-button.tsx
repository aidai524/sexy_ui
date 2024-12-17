import styles from "./index.module.css";

export default function NextButton({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="150"
      viewBox="0 0 40 150"
      fill="none"
      className={`${styles.NextButton} button`}
      onClick={onClick}
    >
      <path
        d="M0 20C0 8.9543 8.95431 0 20 0H40V150H20C8.95431 150 0 141.046 0 130V20Z"
        fill="#D9D9D9"
        fillOpacity="0.3"
      />
      <path
        d="M20.1425 82.2852L28.2852 74.1426L20.1425 66"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
