import Holder from "../../holder";
import LoadMore from "../loadMore";
import PreUser from "../preUser";
import CommentComp from "../../comment";
import Tags from "../../tags";
import Arrow from "../../icons/arrow";
import { Avatar } from "../avatar";
import Likes from "../likes";
import styles from "./index.module.css";
import Tab from "./tab";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounceFn } from "ahooks";
import { useUserAgent } from "@/app/context/user-agent";

export default function Progress({
  data,
  showTags,
  showDesc,
  descContentRef,
  onGoDetail,
  showDropdownIcon,
  showProgress,
  isCommentLoading,
  commentHasMore,
  loadMoreComment,
  commentList
}: any) {
  const [progressIndex, setProgressIndex] = useState(0);
  const router = useRouter();
  const commentRef = useRef<any>();
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(false);
  const { isMobile } = useUserAgent();

  const progresses = useMemo(
    () =>
      data.status !== 0
        ? ["Img", "Discussion", "Holders"]
        : ["Img", "Discussion", "Founders"],
    [data]
  );

  useEffect(() => {
    const inter = setInterval(() => {
      if (stopLoadMore) {
        return;
      }
      if (progressIndex === 1 || progressIndex === 2) {
        const hasVertical =
          commentRef.current.scrollHeight > commentRef.current.clientHeight;
        setShowLoadMore(hasVertical);
      } else {
        setShowLoadMore(false);
      }
    }, 500);

    return () => {
      clearInterval(inter);
    };
  }, [progressIndex, stopLoadMore]);

  const { run: loadMoreRun } = useDebounceFn(
    () => {
      if (
        commentRef.current.scrollHeight ===
        commentRef.current.scrollTop + commentRef.current.clientHeight
      ) {
        setStopLoadMore(true);
        setShowLoadMore(false);
      } else {
        setStopLoadMore(false);
        setShowLoadMore(true);
      }
    },
    {
      wait: 200
    }
  );
  return (
    <>
      {showProgress && (
        <>
          <div className={styles.picProgress}>
            {progresses.map((progress, index) => (
              <Tab
                key={index}
                onClick={() => {
                  setProgressIndex(index);
                  if (index !== 0) {
                    setStopLoadMore(false);
                    setShowLoadMore(false);
                  }
                }}
                isActive={progressIndex === index}
                text={progress}
              />
            ))}
          </div>

          {progressIndex === 1 && (
            <div
              className={styles.commentList}
              style={{ paddingTop: isMobile ? 30 : 40 }}
            >
              <Avatar data={data} showBackIcon={isMobile} />
              <div
                className={styles.commentBox}
                ref={commentRef}
                onScroll={(e) => {
                  loadMoreRun();
                }}
              >
                <CommentComp
                  titleStyle={{ color: "#fff" }}
                  id={data.id}
                  showEdit={false}
                  usePanel={false}
                  {...{
                    isCommentLoading,
                    commentHasMore,
                    loadMoreComment,
                    commentList
                  }}
                />
              </div>
              {showLoadMore && (
                <LoadMore
                  onClick={() => {
                    if (commentRef.current) {
                      commentRef.current.scrollTo({
                        top:
                          commentRef.current.scrollTop +
                          commentRef.current.clientHeight -
                          20
                      });
                    }
                  }}
                />
              )}
            </div>
          )}

          {progressIndex === 2 && (
            <div
              className={styles.commentList}
              style={{ paddingTop: isMobile ? 30 : 40 }}
            >
              <Avatar data={data} showBackIcon={isMobile} />
              <div style={{ height: 10 }}></div>
              <div
                className={styles.commentBox}
                ref={commentRef}
                onScroll={(e) => {
                  loadMoreRun();
                }}
              >
                {data.status === 0 ? (
                  <PreUser token={data} />
                ) : (
                  <Holder
                    showAvatar={true}
                    hideBg={true}
                    address={data.address}
                  />
                )}
              </div>
              {showLoadMore && (
                <LoadMore
                  onClick={() => {
                    if (commentRef.current) {
                      commentRef.current.scrollTo({
                        top:
                          commentRef.current.scrollTop +
                          commentRef.current.clientHeight -
                          20
                      });
                    }
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
      {showDesc && progressIndex === 0 && (
        <div className={styles.descContent} ref={descContentRef}>
          <Likes data={data} />

          <div className={styles.tokenMsg}>
            <Avatar data={data} />

            <div className={styles.desc}>{data.about}</div>

            {showDropdownIcon && (
              <button
                className={styles.detailLink}
                onClick={() => {
                  onGoDetail
                    ? onGoDetail()
                    : router.push(`/detail?address=${data.address}`);
                }}
              >
                <Arrow />
              </button>
            )}
          </div>
          {showTags && <Tags data={data} />}
        </div>
      )}
    </>
  );
}
