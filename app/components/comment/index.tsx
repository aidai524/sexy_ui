import { useState } from "react";
import Panel from "../panel";
import styles from "./comment.module.css";
import type { Comment } from "@/app/type";
import { httpAuthPost } from "@/app/utils";
import CommentItem from "./item";
import SexInfiniteScroll from "../sexInfiniteScroll";
import Empty from "../empty";
import { useAuth } from "@/app/context/auth";
import { Modal } from "antd-mobile";
import MainBtn from "../mainBtn";

export default function CommentComp({
  id,
  usePanel = true,
  titleStyle,
  theme = "dark",
  isCommentLoading,
  commentHasMore,
  loadMoreComment,
  commentList,
  update,
  token,
  onSuccess
}: any) {
  const [commentText, setCommentText] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { userInfo } = useAuth();

  const CommentList = commentList.map((item: any) => {
    return (
      <CommentItem
        key={item.id}
        item={item}
        onSuccess={() => {
          // loadMoreComment(0);
        }}
        onSuccessNow={(item: any) => {
          console.log("onSuccessNow", item);
          update && update();
        }}
      />
    );
  });

  const Content = (
    <>
      <div className={styles.title} style={titleStyle}>
        <div>Commnet({token.comment})</div>
        <div
          className={styles.postBtn}
          onClick={() => {
            setShowEdit(true);
          }}
        >
          Post
        </div>
      </div>

      {commentList.length > 0 && <div>{CommentList}</div>}

      {commentList.length === 0 && !showEdit && !isCommentLoading && (
        <div
          style={{
            marginTop: 30
          }}
        >
          <Empty text="No discussion" />
        </div>
      )}

      <Modal
        visible={showEdit}
        content={
          <div
            className={styles.inputWrapper}
            style={{
              backgroundColor: theme === "dark" ? "#000" : "transparent"
            }}
          >
            <div className={styles.inputTitle}>Comments</div>
            <textarea
              maxLength={200}
              value={commentText}
              onKeyUp={async (e) => {
                if (!userInfo?.address) {
                  // @ts-ignore
                  window?.connect();
                  return;
                }
                if (e.keyCode === 13 && commentText) {
                  if (isSubmiting) {
                    return;
                  }
                  setIsSubmiting(true);

                  const query: any = {
                    project_id: id,
                    text: commentText
                  };
                  const queryStr = Object.keys(query)
                    .map((key) => `${key}=${encodeURIComponent(query[key])}`)
                    .join("&");
                  const val = await httpAuthPost(
                    "/project/comment?" + queryStr
                  );

                  if (val.code === 0) {
                    loadMoreComment(0);
                    setCommentText("");
                    onSuccess?.();
                  }

                  setIsSubmiting(false);
                }
              }}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
              className={`${styles.input} ${
                theme === "light" ? styles.LightInput : styles.DarkInput
              }`}
              placeholder="Say something..."
            />

            <MainBtn
              onClick={async () => {
                if (!userInfo?.address) {
                  // @ts-ignore
                  window?.connect();
                  return;
                }

                if (isSubmiting) {
                  return;
                }
                setIsSubmiting(true);

                const query: any = {
                  project_id: id,
                  text: commentText
                };
                const queryStr = Object.keys(query)
                  .map((key) => `${key}=${encodeURIComponent(query[key])}`)
                  .join("&");
                const val = await httpAuthPost("/project/comment?" + queryStr);

                if (val.code === 0) {
                  loadMoreComment(0);
                  setCommentText("");
                  setShowEdit(false);
                  onSuccess?.();
                }

                setIsSubmiting(false);
              }}
              style={{
                backgroundColor: "#9AB3EF",
                color: "#000",
                marginTop: 15
              }}
            >
              Post
            </MainBtn>
          </div>
        }
        closeOnAction
        closeOnMaskClick
        className="no-bg"
        onClose={() => {
          setShowEdit(false);
        }}
      />

      <SexInfiniteScroll loadMore={loadMoreComment} hasMore={commentHasMore} />
    </>
  );

  return (
    <div className={`${styles.main} ${theme === "light" && styles.LightMain}`}>
      {usePanel ? <Panel theme={theme}>{Content}</Panel> : <>{Content}</>}
    </div>
  );
}
