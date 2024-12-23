import Thumbnail, { AvatarBack } from "@/app/components/thumbnail";
import CommentComp from "@/app/components/comment";
import Panel from "../../../../components/panel";

import styles from "./detail.module.css";
import LaunchingAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import { Button } from "antd-mobile";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import InfoPart from "./infoPart";
import { useEffect, useState } from "react";
import type { Comment, Project } from "@/app/type";
import { httpAuthPost, httpGet } from "@/app/utils";
import { actionHateTrigger, actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";

interface Props {
  data: Project;
  onUpdate: () => void;
}

export default function Info({ data, onUpdate }: Props) {
  return (
    <div className={styles.main}>
      <InfoPart showLikes={true} data={data} showThumbnailHead={false} />
      <CommentComp id={data.id} />

      <div className={styles.action}>
        {data.status === 0 ? (
          <LaunchingAction
            token={data}
            style={{ position: "static" }}
            onLike={async () => {
              await actionLikeTrigger(data)
              // await httpAuthPost("/project/like?id=" + data!.id, {});
              onUpdate()
            }}
            onHate={async () => {
              await actionHateTrigger(data)
              onUpdate()
            }}
            onSuperLike={() => {
              onUpdate()
            }}
            onBoost={() => {
              onUpdate()
            }}
          />
        ) : (
          <LaunchedAction data={data} />
        )}
      </div>
    </div>
  );
}
