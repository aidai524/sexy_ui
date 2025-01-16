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
            className={`${styles.Item} ${isMobile && styles.PcItem} ${
              !disabled && "button"
            }`}
            onClick={() => {
              if (token.isSuperLike || disabled) return;
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
          <button
            className={`${styles.Item} ${isMobile && styles.PcItem} ${
              !disabled && "button"
            }`}
            onClick={() => {
              if (!disabled) onClick("trade");
            }}
          >
            <img src="/img/home/holder-icon.png" style={{ width: 34 }} />
            <span>{totalHolders}</span>
          </button>
        </>
      )}
      <button
        className={`${styles.Item} ${isMobile && styles.PcItem} ${
          !disabled && "button"
        }`}
        onClick={() => {
          if (!disabled) onClick("comments");
        }}
      >
        <CommentIcon />
        <span>{token.comment || 0}</span>
      </button>
      <button
        className={`${styles.Item} ${isMobile && styles.PcItem} ${
          !disabled && "button"
        }`}
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
        <ShareIcon />
        <span>{token.share_num || 0}</span>
      </button>
    </div>
  );
}
