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

interface Props {
  data: Project;
}

export default function Info({ data }: Props) {
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
              await httpAuthPost("/project/like?id=" + data!.id, {});
            }}
            onHate={async () => {
              await httpAuthPost("/project/un_like?id=" + data!.id, {});
            }}
            onSuperLike={() => {}}
            onBoost={() => {}}
          />
        ) : (
          <LaunchedAction data={data} />
        )}
      </div>
    </div>
  );
}
