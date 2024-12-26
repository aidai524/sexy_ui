import { useCallback, useEffect, useState } from "react";
import Panel from "../panel";
import styles from "./comment.module.css";

import type { Comment, Project } from "@/app/type";
import { httpGet, httpAuthPost } from "@/app/utils";
import CommentItem from "./item";
import SexInfiniteScroll from "../sexInfiniteScroll";

interface Props {
  id: number | undefined;
  showEdit?: boolean;
  usePanel?: boolean;
  titleStyle?: any;
  theme?: string;
  loadMoreData?: number;
}

export default function CommentComp({
  id,
  showEdit = true,
  usePanel = true,
  titleStyle,
  theme = "dark",
  loadMoreData,
}: Props) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [reReashNum, setReReashNum] = useState(1);
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isSubmiting, setIsSubmiting] = useState(false);

  const CommentList = commentList.map((item) => {
    return (
      <CommentItem
        key={item.id}
        item={item}
        onSuccessNow={(item: Comment) => {
          setCommentList([...commentList]);
        }}
        onSuccess={(item: Comment) => {
          // setReReashNum(reReashNum + 1);
        }}
      />
    );
  });

  useEffect(() => {
    if (id) {
      loadMore()
    } else {
      setCommentList([]);
      setOffset(0)
    }
  }, [id]);

  useEffect(() => {
    if (loadMoreData && loadMoreData > 1) {
      loadMore()
    }
  }, [loadMoreData])

  const loadMore = useCallback(({ newOffset }: any = {}) => {
    if (newOffset !== 0 && !hasMore) {
      return Promise.resolve()
    }
    return httpGet("/project/comment/list", { 
      limit: 10, 
      project_id: id, 
      offset: newOffset === 0 ? newOffset : offset,
    }).then(
      (res) => {
        if (res?.code === 0 && res.data.list?.length) {
          setHasMore(res.data?.has_next_page || false)
          const newMapList = res.data.list.map((item: any) => {
            return mapDataToComment(item);
          });

          let newList = []
          if (newOffset === 0) {
            newList = newMapList
          } else {
            newList = [
              ...commentList,
              ...newMapList,
            ]
          }

          setOffset(newList.length)
          setCommentList(newList);
        }
      }
    );
  }, [id, offset])

  const Content = (
    <>
      <div className={styles.title} style={titleStyle}>
        Discussion
      </div>
      {showEdit && (
        <div className={styles.inputWrapper}>
          <input
            value={commentText}
            onKeyUp={async (e) => {
              if (e.code === "Enter" && commentText) {
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
                  loadMore({ newOffset: 0 })
                  // setReReashNum(reReashNum + 1);
                  setCommentText("");
                }

                setIsSubmiting(false);
              }
            }}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            className={`${styles.input} ${theme === "light" ? styles.LightInput : styles.DarkInput
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
                    fill-opacity="0.22"
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
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
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

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );

  return (
    <div className={`${styles.main} ${theme === "light" && styles.LightMain}`}>
      {usePanel ? <Panel theme={theme}>{Content}</Panel> : <>{Content}</>}
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
