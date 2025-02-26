import { useState } from "react";
import Panel from "../panel";
import styles from "./comment.module.css";
import { httpAuthPost } from "@/app/utils";
import CommentItem from "./item";
import SexInfiniteScroll from "../sexInfiniteScroll";
import Empty from "../empty";
import { useAuth } from "@/app/context/auth";
import Modal from "../modal";
import MainBtn from "../mainBtn";
import { fail } from "@/app/utils/toast";
import { useUserAgent } from "@/app/context/user-agent";

export default function CommentComp({
  id,
  usePanel = true,
  titleStyle,
  theme = "dark",
  isCommentLoading,
  commentHasMore,
  loadMoreComment,
  commentList = [],
  update,
  token,
  isPreview,
  onSuccess,
  from
}: any) {
  const [commentText, setCommentText] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { isMobile } = useUserAgent();
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
          update && update();
        }}
      />
    );
  });

  const Content = (
    <>
      <div className={styles.title} style={titleStyle}>
        <div>
          Comments(
          {isPreview
            ? 0
            : Math.max(token?.comment || 0, CommentList.length || 0)}
          )
        </div>
        <div
          className={styles.postBtn}
          style={{
            opacity: isPreview ? 0.5 : 1
          }}
          onClick={() => {
            if (isPreview) {
              return;
            }

            if (!userInfo?.address) {
              window?.connect();
              return;
            }
            setShowEdit(true);
          }}
        >
          Comment
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
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
        }}
        animation={isMobile ? "popup" : "modal"}
        forceNoCloseIcon={isMobile}
      >
        <div
          className={styles.inputWrapper}
          style={{
            width: isMobile ? "100vw" : 375,
            borderRadius: isMobile ? "20px 20px 0px 0px" : 20
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
                const val = await httpAuthPost("/project/comment?" + queryStr);

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
            className={`${styles.input}`}
            placeholder="Say something..."
          />

          <MainBtn
            isLoading={isSubmiting}
            onClick={async () => {
              if (!userInfo?.address) {
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
              } else {
                fail(
                  `Post comment failed${val.message ? ": " + val.message : ""}.`
                );
              }

              setIsSubmiting(false);
            }}
            style={{
              backgroundColor: "#9AB3EF",
              color: "#000",
              marginTop: 15,
              height: 50
            }}
          >
            Post
          </MainBtn>
        </div>
      </Modal>

      <SexInfiniteScroll loadMore={loadMoreComment} hasMore={commentHasMore} />
    </>
  );

  return (
    <div
      className={`${styles.main}`}
      style={{
        height: from === "panel" ? "100%" : "auto",
        padding: from === "panel" ? "16px 30px" : "10px 0px 100px",
        backgroundColor: from === "panel" ? "#1B1B1B" : "transparent"
      }}
    >
      {usePanel ? <Panel theme={theme}>{Content}</Panel> : <>{Content}</>}
    </div>
  );
}
