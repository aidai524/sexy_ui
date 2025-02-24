import { useMemo } from "react";
import styles from "./index.module.css";
import Image from "next/image";
import { getVideoExt } from "@/app/components/upload";
import VideoPlayer from "@/app/components/video";
import { isVideoFile } from "@/app/utils/common";
import clsx from "clsx";

export default function TokenIcon({
  token,
  onClick = () => {},
  className
}: any) {
  const progress = useMemo(() => {
    if (token.status === 3) return 0;
    if (token.status === 0) {
      return (token.like / 100) * 138.23;
    }
    return (token.bondingProgress / 100) * 138.23;
  }, [token]);
  return (
    <div
      className={clsx(styles.Container, className, "button")}
      onClick={onClick}
    >
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
      {isVideoFile(token?.icon) ? (
        <VideoPlayer
          key={token.icon}
          id={token.id}
          src={token.icon}
          type={getVideoExt(token.icon)}
          className={styles.Icon}
          autoPlay={false}
          token={token}
        />
      ) : (
        <img
          src={token?.icon || "/img/token-placeholder.png"}
          className={styles.Icon}
          loading="lazy"
        />
      )}
      {token.is_king && (
        <div className={styles.King}>
          👑
          <Image
            className={styles.KingAnimation}
            src="/img/animation-king.gif"
            width={20}
            height={20}
            alt="King Animation"
          />
        </div>
      )}
    </div>
  );
}
