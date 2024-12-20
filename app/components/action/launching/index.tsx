"use client";

import styles from "../action.module.css";
import MainAction from "@/app/components/MainAction";
import Boost from "@/app/components/boost";
import SmokeBtn from "../../smokHot";
import type { Project } from "@/app/type";

interface Props {
  token: Project | undefined;
  style?: any;
  onLike?: () => void;
  onSuperLike?: () => void;
  onHate?: () => void;
  onBoost?: () => void;
}

export default function Action({
  style,
  token,
  onLike,
  onSuperLike,
  onHate,
  onBoost
}: Props) {
  if (!token) {
    return null;
  }

  return (
    <div className={styles.action} style={style}>
      <div>
        <Boost
          token={token}
          onClick={() => {
            onBoost && onBoost();
          }}
        />
      </div>
      <MainAction
        onLike={() => {
          onLike && onLike();
        }}
        onHate={() => {
          onHate && onHate();
        }}
      />
      <div>
        <SmokeBtn
          token={token}
          onClick={() => {
            onSuperLike && onSuperLike();
          }}
        />
      </div>
    </div>
  );
}
