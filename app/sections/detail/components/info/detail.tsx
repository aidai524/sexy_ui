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
import { useDebounceFn } from "ahooks";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { useUserAgent } from "@/app/context/user-agent";
import useCommentList from "@/app/hooks/use-comment-list";

interface Props {
  data: Project;
  mc?: string | number;
  showHodler?: boolean;
  onUpdate: (type?: string) => void;
}

export default function Info({ data, mc, onUpdate, showHodler = true }: Props) {
  const { isMobile } = useUserAgent();
  const comments = useCommentList({ id: data?.id });

  return (
    <div className={styles.main}>
      <InfoPart
        showLikes={true}
        mc={mc}
        data={data}
        theme="light"
        showHolders={showHodler}
      />
      {/* <CommentComp id={data.id} {...comments} /> */}

   
    </div>
  );
}
