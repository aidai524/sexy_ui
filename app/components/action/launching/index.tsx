"use client";

import styles from "../action.module.css";
import MainAction from "@/app/components/MainAction";
import Boost from "@/app/components/boost";
import SmokeBtn from "../../smokHot";
import type { Project } from "@/app/type";

interface Props {
  token: Project | undefined;
  style?: any;
  ids?: any;
  onLike?: () => void;
  onSuperLike?: () => void;
  onHate?: () => void;
  onBoost?: () => void;
}

export default function Action({
  style,
  token,
  ids,
  onLike,
  onSuperLike,
  onHate,
  onBoost
}: Props) {
  if (!token) {
    return (
      <div className={styles.actionEmptyBox}>
        {/* <img src="/img/home/emptyAction.png" /> */}
        <img src="/img/home/empty-action.png" />
      </div>
    );
  }

  return (
    <div className={styles.action} style={style}>
      <div>
        <Boost
          isBigIcon={true}
          token={token}
          onClick={() => {
            onBoost && onBoost();
          }}
          id={ids?.boost}
        />
      </div>
      <MainAction
        onLike={() => {
          onLike && onLike();
        }}
        onHate={() => {
          onHate && onHate();
        }}
        ids={ids}
      />
      <div>
        <SmokeBtn
          isBigIcon={true}
          token={token}
          onClick={() => {
            onSuperLike && onSuperLike();
          }}
          id={ids?.smoke}
        />
      </div>
    </div>
  );
}
