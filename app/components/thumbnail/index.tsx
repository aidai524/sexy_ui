import Link from "next/link";
import Tags from "../tags";
import styles from "./thumbnail.module.css";
import type { Project } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import CommentComp from "../comment";
import { videoReg } from "../upload";
import Likes from "./likes";
import Holder from "../holder";
import LoadMore from "./loadMore";
import PreUser from "./preUser";
import { AvatarBack, Avatar } from "./avatar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Arrow from "../icons/arrow";
import { useThrottleFn } from "ahooks";

interface Props {
  showDesc: boolean;
  topDesc?: boolean;
  showProgress?: boolean;
  data: Project;
  autoHeight?: boolean;
  showBackIcon?: boolean;
  showLaunchType?: boolean;
  showLikes?: boolean;
  showTags?: boolean;
  showDropdownIcon?: boolean;
  style?: any;
}

export default function Thumbnail({
  showDesc = true,
  topDesc = false,
  showProgress = false,
  autoHeight = false,
  showBackIcon = true,
  showLaunchType = true,
  showLikes = false,
  showTags = true,
  showDropdownIcon = true,
  data,
  style = {}
}: Props) {
  const [progressIndex, setProgressIndex] = useState(0);
  const [loadCommentNum, setLoadCommentNum] = useState(1);
  const commentRef = useRef<any>();
  const [height, setHeight] = useState("calc(100vh - 232px)");
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight - 232 + "px");
    }
  }, []);

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

  const { run: loadMoreRun } = useThrottleFn(
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

  if (!data) {
    return;
  }

  return (
    <div>
      {topDesc && (
        <AvatarBack
          data={data}
          showBackIcon={showBackIcon}
          showLaunchType={showLaunchType}
        />
      )}

      <div
        className={styles.thumbnail}
        style={{
          height: autoHeight ? "auto" : height,
          ...style
        }}
      >
        {showProgress && (
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
        )}

        <div className={styles.imgList}>
          <div className={styles.ImgWrapper}>
            {videoReg.test(data.tokenImg) ? (
              <video
                width="100%"
                className={styles.imgPreview}
                autoPlay={false}
              >
                <source src={data.tokenImg} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <LazyLoadImage
                effect="blur"
                className={styles.tokenImg}
                src={data.tokenImg || "/img/token-placeholder.png"}
              />
            )}
          </div>
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
              {data.status === 0 ? <PreUser token={data} /> : <Holder />}
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

        {showDesc && progressIndex === 0 && (
          <div className={styles.descContent}>
            <Likes data={data} />

            <div className={styles.tokenMsg}>
              <Avatar data={data} />

              <div className={styles.desc}>{data.about}</div>

              {showDropdownIcon && (
                <div className={styles.detailLink}>
                  <Link href={"/detail?id=" + data.id}>
                    <Arrow />
                  </Link>
                </div>
              )}
            </div>
            {showTags && <Tags data={data} />}
          </div>
        )}

        {showLikes && (
          <div className={styles.bottomLike}>
            <Likes data={data} />{" "}
          </div>
        )}
      </div>
    </div>
  );
}
