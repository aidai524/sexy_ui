import { useRouter } from "next/navigation";
import styles from "./index.module.css";

export default function Back() {
  const router =useRouter()

  return (
    <div className={styles.main} onClick={() => router.back()}>
      <svg
        width="9"
        height="16"
        viewBox="0 0 9 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 14.5L1.5 8L7.5 1.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}
