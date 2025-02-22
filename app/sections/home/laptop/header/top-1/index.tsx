import styles from "./index.module.css";
import Image from "next/image";
import { useTrends } from "@/app/sections/trends/hooks";
import { numberFormatter } from "@/app/utils/common";
export default function Top1() {
  const { top1 } = useTrends({ isPolling: true });
  console.log(6, top1);
  return (
    <div className={styles.Container}>
      <div className={styles.IconWrapper}>
        <img
          src={top1?.Icon || "/img/token-placeholder.png"}
          className={styles.Icon}
          loading="lazy"
        />
        <div className={styles.King}>
          👑
          <Image
            className={styles.KingAnimation}
            src="/img/animation-king.gif"
            width={16}
            height={16}
            alt="King Animation"
          />
        </div>
      </div>
      <div>
        <span
          style={{
            color: "#FBCA04"
          }}
        >
          [Crowned]
        </span>{" "}
        <span>NIA</span>{" "}
        <span
          style={{
            color: "#C9FF5D"
          }}
        >
          MCap{" "}
          {numberFormatter(top1?.market_cap, 2, true, {
            prefix: "$",
            isShort: true
          })}
        </span>
      </div>
    </div>
  );
}
