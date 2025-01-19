"use client";

import styles from "../action.module.css";
import MainAction from "@/app/components/MainAction";
import Boost from "@/app/components/boost";
import { useUserAgent } from "@/app/context/user-agent";
import type { Project } from "@/app/type";

interface Props {
  token: Project | undefined;
  style?: any;
  ids?: any;
  canFlip: boolean;
  onLike?: () => void;
  onSuperLike?: (amount?: string) => void;
  onHate?: () => void;
  onBoost?: () => void;
}

export default function Action({
  style,
  token,
  ids,
  canFlip,
  onLike,
  onSuperLike,
  onHate,
  onBoost
}: Props) {
  const { isMobile } = useUserAgent();
  if (!token) {
    return <div />;
  }

  return (
    <div
      className={styles.action}
      style={{ ...style, width: isMobile ? "100%" : 300 }}
    >
      {/* <div>
        <Boost
          isBigIcon={true}
          token={token}
          onClick={() => {
            onBoost && onBoost();
          }}
          id={ids?.boost}
        />
      </div> */}
      <MainAction
        onLike={() => {
          onLike && onLike();
        }}
        onHate={() => {
          onHate && onHate();
        }}
        ids={ids}
        token={token}
        canFlip={canFlip}
        onSuperLike={onSuperLike}
      />
    </div>
  );
}
