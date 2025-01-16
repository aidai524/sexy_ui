import styles from "./index.module.css";
import Like from "./like";
import HomeIcon from "@/app/components/icons/home";
import CommentIcon from "@/app/components/icons/comment";
import ShareIcon from "./share-icon";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";
import { useUserAgent } from "@/app/context/user-agent";

export default function Actions({
  token,
  totalHolders,
  onClick = () => {},
  onSuccess,
  isCurrent,
  disabled
}: any) {
  const { showShare } = useMessage();
  const { isMobile } = useUserAgent();
  return (
    <div
      className={`${styles.Actions} ${isMobile && styles.MbActions}`}
      style={{
        opacity: disabled ? 0.3 : 1
      }}
    >
      {token.status === 0 ? (
        <>
          <Like
            isLiked={token.isLike}
            like={token.like}
            onClick={async () => {
              if (token.isLike || disabled) return;
              if (!window.sexAddress) {
                window.connect();
                return;
              }
              const result = await actionLikeTrigger(token, showShare);
              if (result) onSuccess("like");
            }}
            id={isCurrent ? "guid-tour-like" : ""}
          />
          <button
            className={styles.Item}
            onClick={() => {
              if (token.isSuperLike || disabled) return;
              onClick("flip");
            }}
          >
            <button
              className={`${!disabled ? "button" : ""} ${
                !isMobile && styles.PcItem
              }`}
            >
              <HomeIcon
                size={30}
                type={token.isSuperLike ? "primary" : "normal"}
              />
            </button>
            <span>{token.prePaid}</span>
          </button>
        </>
      ) : (
        <>
          <button
            className={styles.Item}
            onClick={() => {
              if (!disabled) onClick("trade");
            }}
          >
            <button
              className={`${!disabled ? "button" : ""} ${
                !isMobile && styles.PcItem
              }`}
            >
              <img src="/img/home/holder-icon.png" style={{ width: 34 }} />
            </button>

            <span>{totalHolders}</span>
          </button>
        </>
      )}
      <button
        className={styles.Item}
        onClick={() => {
          if (!disabled) onClick("comments");
        }}
      >
        <button
          className={`${!disabled ? "button" : ""} ${
            !isMobile && styles.PcItem
          }`}
        >
          <CommentIcon />
        </button>
        <span>{token.comment || 0}</span>
      </button>
      <button
        className={styles.Item}
        onClick={() => {
          if (disabled) return;
          if (!window?.sexAddress) {
            window.connect();
            return;
          }
          showShare(token);
          onSuccess("share");
        }}
      >
        <button
          className={`${!disabled ? "button" : ""} ${
            !isMobile && styles.PcItem
          }`}
        >
          <ShareIcon />
        </button>
        <span>{token.share_num || 0}</span>
      </button>
    </div>
  );
}
