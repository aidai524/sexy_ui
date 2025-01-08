import Holder from "../../holder";
import LoadMore from "../loadMore";
import PreUser from "../preUser";
import CommentComp from "../../comment";
import Tags from "../../tags";
import Arrow from "../../icons/arrow";
import { Avatar } from "../avatar";
import Likes from "../likes";
import styles from "./index.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounceFn } from "ahooks";

export default function Progress({
  data,
  showTags,
  showDesc,
  descContentRef,
  onGoDetail,
  showDropdownIcon,
  showProgress
}: any) {
  const [progressIndex, setProgressIndex] = useState(0);
  const router = useRouter();
  const [loadCommentNum, setLoadCommentNum] = useState(1);
  const commentRef = useRef<any>();
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(false);

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
            <div
              onClick={() => {
                setProgressIndex(0);
              }}
              className={[
                styles.progressItem,
                progressIndex === 0 ? styles.progressItemActive : ""
              ].join(" ")}
            ></div>
            <div
              onClick={() => {
                setStopLoadMore(false);
                setShowLoadMore(false);
                setProgressIndex(1);
              }}
              className={[
                styles.progressItem,
                progressIndex === 1 ? styles.progressItemActive : ""
              ].join(" ")}
            ></div>
            <div
              onClick={() => {
                setStopLoadMore(false);
                setShowLoadMore(false);
                setProgressIndex(2);
              }}
              className={[
                styles.progressItem,
                progressIndex === 2 ? styles.progressItemActive : ""
              ].join(" ")}
            ></div>
          </div>

          {progressIndex === 1 && (
            <div className={styles.commentList}>
              <Avatar data={data} showBackIcon={true} />
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
            <div className={styles.commentList}>
              <Avatar data={data} showBackIcon={true} />
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
