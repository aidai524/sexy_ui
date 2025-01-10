import { useState } from "react";
import styles from "./index.module.css";
import HomeIcon from "@/app/components/icons/home";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useDebounceFn } from "ahooks";

let startX = 0;
export default function Flip({ token, onSuccess, onClick }: any) {
  const [x, setX] = useState(0);
  const [loading, setLoading] = useState(false);
  const { prePaid } = useTokenTrade({
    tokenName: token?.tokenName,
    tokenSymbol: token?.tokenSymbol,
    tokenDecimals: token?.tokenDecimals,
    loadData: false
  });

  const { run } = useDebounceFn(
    async () => {
      try {
        setLoading(true);
        await prePaid(0.1 * 1e8);
      } catch (err) {
      } finally {
        setLoading(false);
        setX(0);
      }
    },
    { wait: 500 }
  );

  return (
    <>
      <div className={styles.Container}>
        <button
          className={`button ${styles.FlipButton}`}
          onClick={onClick}
          style={{
            transform: `translateX(${x}px)`
          }}
          onTouchStart={(ev: any) => {
            ev.stopPropagation();
            startX = ev.touches[0].clientX;
          }}
          onTouchMove={(ev) => {
            let diff = ev.touches[0].clientX - startX;
            if (diff < 0) {
              diff = 0;
            }
            if (diff > 160) {
              diff = 170;
              run();
            }
            setX(diff);
          }}
        >
          <HomeIcon size={28} type="black" />
          <span>{loading ? "0.1 SOL" : "Flip it!"}</span>
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="16"
          viewBox="0 0 75 16"
          fill="none"
          className={styles.Line}
        >
          <path
            d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM74.7071 8.70711C75.0976 8.31659 75.0976 7.68342 74.7071 7.2929L68.3431 0.928938C67.9526 0.538414 67.3195 0.538414 66.9289 0.928938C66.5384 1.31946 66.5384 1.95263 66.9289 2.34315L72.5858 8.00001L66.9289 13.6569C66.5384 14.0474 66.5384 14.6805 66.9289 15.0711C67.3195 15.4616 67.9526 15.4616 68.3431 15.0711L74.7071 8.70711ZM1 9L3.02778 9L3.02778 7L1 7L1 9ZM7.08333 9L11.1389 9L11.1389 7L7.08333 7L7.08333 9ZM15.1944 9L19.25 9L19.25 7L15.1944 7L15.1944 9ZM23.3056 9L27.3611 9L27.3611 7L23.3056 7L23.3056 9ZM31.4167 9L35.4722 9L35.4722 7L31.4167 7L31.4167 9ZM39.5278 9L43.5833 9L43.5833 7L39.5278 7L39.5278 9ZM47.6389 9L51.6945 9L51.6945 7L47.6389 7L47.6389 9ZM55.75 9L59.8056 9.00001L59.8056 7.00001L55.75 7L55.75 9ZM63.8611 9.00001L67.9167 9.00001L67.9167 7.00001L63.8611 7.00001L63.8611 9.00001ZM71.9722 9.00001L74 9.00001L74 7.00001L71.9722 7.00001L71.9722 9.00001Z"
            fill="white"
            fillOpacity="0.3"
          />
        </svg>
        <div className={styles.Right}>
          <div className={styles.Label}>Quick buy</div>
          <div className={styles.Value}>0.1 SOL</div>
        </div>
      </div>
    </>
  );
}
