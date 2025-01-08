import { useState } from "react";
import Panel from "../panel";
import styles from "./comment.module.css";
import type { Comment } from "@/app/type";
import { httpAuthPost } from "@/app/utils";
import CommentItem from "./item";
import SexInfiniteScroll from "../sexInfiniteScroll";
import Empty from "../empty";
import { useAuth } from "@/app/context/auth";

export default function CommentComp({
  id,
  showEdit = true,
  usePanel = true,
  titleStyle,
  theme = "dark",
  isCommentLoading,
  commentHasMore,
  loadMoreComment,
  commentList
}: any) {
  const [commentText, setCommentText] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { userInfo } = useAuth();

  const CommentList = commentList.map((item: any) => {
    return <CommentItem key={item.id} item={item} />;
  });

  const Content = (
    <>
      <div className={styles.title} style={titleStyle}>
        Discussion
      </div>
      {showEdit && (
        <div
          className={styles.inputWrapper}
          style={{ backgroundColor: theme === "dark" ? "#000" : "transparent" }}
        >
          <input
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

          {commentText && (
            <div
              onClick={() => {
                setCommentText("");
              }}
              className={styles.inputClear}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_b_4178_1714)">
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#888197"
                    fillOpacity="0.22"
                  />
                </g>
                <path
                  d="M8 8L16 16"
                  stroke="#888197"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 8L8 16"
                  stroke="#888197"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <filter
                    id="filter0_b_4178_1714"
                    x="-10"
                    y="-10"
                    width="44"
                    height="44"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_4178_1714"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_4178_1714"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          )}
        </div>
      )}

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

      <SexInfiniteScroll loadMore={loadMoreComment} hasMore={commentHasMore} />
    </>
  );

  return (
    <div className={`${styles.main} ${theme === "light" && styles.LightMain}`}>
      {usePanel ? <Panel theme={theme}>{Content}</Panel> : <>{Content}</>}
    </div>
  );
}
