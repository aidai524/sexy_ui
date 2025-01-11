import styles from "./index.module.css";
import Like from "./like";
import HomeIcon from "@/app/components/icons/home";
import CommentIcon from "@/app/components/icons/comment";
import ShareIcon from "@/app/components/icons/share";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";

export default function Actions({
  token,
  totalHolders,
  onClick,
  onSuccess
}: any) {
  const { showShare } = useMessage();
  return (
    <div className={styles.Actions}>
      {token.status === 0 ? (
        <>
          <Like
            isLiked={token.isLike}
            like={token.like}
            onClick={async () => {
              if (token.isLike) return;
              await actionLikeTrigger(token);
              onSuccess("like");
            }}
          />
          <button
            className={`${styles.Item} button`}
            onClick={() => {
              if (token.isSuperLike) return;
              onClick("flip");
            }}
          >
            <HomeIcon
              size={30}
              type={token.isSuperLike ? "primary" : "normal"}
            />
            <span>{token.prePaid}</span>
          </button>
        </>
      ) : (
        <>
          <button className={`${styles.Item} button`}>
            <img src="/img/home/holder-icon.png" style={{ width: 34 }} />
            <span>{totalHolders}</span>
          </button>
        </>
      )}
      <button
        className={`${styles.Item} button`}
        onClick={() => {
          onClick("comments");
        }}
      >
        <CommentIcon />
        <span>{token.prePaid}</span>
      </button>
      <button
        className={`${styles.Item} button`}
        onClick={() => {
          if (!window?.sexAddress) {
            window.connect();
            return;
          }
          showShare(token);
          onSuccess("share");
        }}
      >
        <ShareIcon />
        <span>{token.prePaid}</span>
      </button>
    </div>
  );
}
