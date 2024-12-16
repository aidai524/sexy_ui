import { useEffect, useState } from "react";
import Panel from "../panel";
import styles from "./comment.module.css";

import type { Comment, Project } from "@/app/type";
import { httpGet, httpAuthPost } from "@/app/utils";
import CommentItem from "./item";

interface Props {
  id: number | undefined;
  showEdit?: boolean;
  usePanel?: boolean;
  titleStyle?: any;
  theme?: string;
}

export default function CommentComp({
  id,
  showEdit = true,
  usePanel = true,
  titleStyle,
  theme = "dark"
}: Props) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [reReashNum, setReReashNum] = useState(1);
  const [isSubmiting, setIsSubmiting] = useState(false)

  const CommentList = commentList.map((item) => {
    return (
      <CommentItem
        key={item.id}
        item={item}
        onSuccessNow={(item: Comment) => {
          setCommentList([...commentList]);
        }}
        onSuccess={(item: Comment) => {
          setReReashNum(reReashNum + 1);
        }}
      />
    );
  });

  useEffect(() => {
    if (id) {
      httpGet("/project/comment/list", { limit: 20, project_id: id }).then(
        (res) => {
          if (res?.code === 0 && res.data.list?.length) {
            const commentList = res.data.list.map((item: any) => {
              return mapDataToComment(item);
            });
            setCommentList(commentList);
          }
        }
      );
    } else {
      setCommentList([]);
    }
  }, [id, reReashNum]);

  return (
    <div className={`${styles.main} ${theme === "light" && styles.LightMain}`}>
      <div className={styles.title} style={titleStyle}>
        Discussion
      </div>
      {showEdit && (
        <input
          value={commentText}
          onKeyUp={async (e) => {
            if (e.code === "Enter" && commentText) {
              if (isSubmiting) {
                return
              }
              setIsSubmiting(true)

              const query: any = {
                project_id: id,
                text: commentText
              };
              const queryStr = Object.keys(query)
                .map((key) => `${key}=${encodeURIComponent(query[key])}`)
                .join("&");
              const val = await httpAuthPost("/project/comment?" + queryStr);

              if (val.code === 0) {
                setReReashNum(reReashNum + 1);
                setCommentText("");
              }

              setIsSubmiting(false)
            }
          }}
          onChange={(e) => {
            // console.log(e)
            setCommentText(e.target.value);
          }}
          className={`${styles.input} ${
            theme === "light" ? styles.LightInput : styles.DarkInput
          }`}
          placeholder="Say something..."
        />
      )}

      {commentList.length > 0 &&
        (usePanel ? (
          <Panel theme={theme}>{CommentList}</Panel>
        ) : (
          <div style={{ padding: "0 10px" }}>{CommentList}</div>
        ))}
    </div>
  );
}

function mapDataToComment(data: any): Comment {
  return {
    address: data.address,
    projectId: data.project_id,
    text: data.text,
    id: data.id,
    isLike: data.is_like,
    isUnlike: data.is_unlike,
    like: data.like,
    unLike: data.un_like,
    time: data.time,
    creater: data.account_data
  };
}
