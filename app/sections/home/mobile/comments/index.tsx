import Image from "next/image";
import styles from "./index.module.css";
import { Popup } from "antd-mobile";
import CommentItem from "@/app/components/comment/item";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import Empty from "@/app/components/empty";
import CircleLoading from "@/app/components/icons/loading";
import useComment from "@/app/hooks/use-comment";
import useCommentList from "@/app/hooks/use-comment-list";

export default function Comments({ show, id, total, onClose, onSuccess }: any) {
  const { isCommentLoading, commentHasMore, loadMoreComment, commentList } =
    useCommentList({ id });
  const { isLoading, commentText, setCommentText, onPostComment } = useComment(
    id,
    () => {
      loadMoreComment(0);
      onSuccess();
    }
  );

  return (
    <Popup
      visible={show}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        border: "1px solid #3B3B3B",
        backgroundColor: "#252328"
      }}
    >
      <div className={styles.Container}>
        <div className={styles.Header}>
          <Image
            src="/img/home/comments-title.png"
            width={176}
            height={95}
            alt="Comments"
          />
          <div className={styles.Nums}>{total || 0} comments</div>
        </div>
        <div className={styles.Content}>
          {commentList.map((comment: any) => (
            <CommentItem key={comment.id} item={comment} />
          ))}
          {commentList.length === 0 && !isCommentLoading && (
            <div
              style={{
                marginTop: 30
              }}
            >
              <Empty text="No discussion" />
            </div>
          )}
          {isCommentLoading && (
            <div className={styles.LoadingWrapper}>
              <CircleLoading size={40} />
            </div>
          )}
          {!!commentList.length && (
            <SexInfiniteScroll
              loadMore={loadMoreComment}
              hasMore={commentHasMore}
            />
          )}
        </div>
        <div className={styles.Footer}>
          <input
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            onKeyUp={(e) => {
              if (!window.sexAddress) {
                window.connect();
                return;
              }
              if (e.keyCode === 13) {
                onPostComment();
              }
            }}
            placeholder="say something..."
            className={styles.Input}
          />
          <button
            onClick={onPostComment}
            className={`${styles.Button} button`}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircleLoading />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
              >
                <path
                  d="M22.6066 0.153358C22.9182 0.372899 23.0447 0.667589 22.9861 1.03145L21.6473 19.5097C21.601 19.7744 21.4498 19.9819 21.1969 20.1292C21.0643 20.2014 20.9131 20.2405 20.7589 20.2375C20.6417 20.2345 20.5275 20.2134 20.4196 20.1683L14.031 17.6242L10.6192 21.6809C10.4496 21.8914 10.2213 21.9997 9.92826 21.9997C9.82336 22.0027 9.71539 21.9846 9.61669 21.9455C9.44086 21.8854 9.2928 21.7711 9.18789 21.6238C9.07993 21.4764 9.0244 21.302 9.0244 21.1216V16.3191L18.9358 4.3995L6.13709 14.4788L0.566023 12.2504C0.217425 12.1211 0.0292805 11.8715 0.00151622 11.4956C-0.0170015 11.1287 0.134157 10.8581 0.451875 10.6837L21.6473 0.123279C21.7892 0.0421054 21.9404 7.35521e-09 22.0977 7.35521e-09C22.2889 7.35521e-09 22.4586 0.0511194 22.6066 0.153358Z"
                  fill="black"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Popup>
  );
}
