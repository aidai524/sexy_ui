import { useMemo } from "react";
import styles from "./index.module.css";

export default function TokenIcon({ token, onClick = () => {} }: any) {
  const progress = useMemo(() => {
    if (token.status === 0) {
      return (token.like / 100) * 138.23;
    }
    return (token.bondingProgress / 100) * 138.23;
  }, [token]);
  return (
    <div className={styles.Container} onClick={onClick}>
      {!!progress && (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className={styles.Progress}
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke={token.status === 0 ? "#FF2681" : "#C9FF5D"}
            strokeWidth="2"
            strokeDasharray={`${progress}, 138.23`}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
          />
        </svg>
      )}
      <img src={token?.icon} className={styles.Icon} />
      {token.is_king && <div className={styles.King}>👑</div>}
    </div>
  );
}
