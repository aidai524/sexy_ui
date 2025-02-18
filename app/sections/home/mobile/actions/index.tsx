import styles from "./index.module.css";
import Like from "./like";
import HomeIcon from "@/app/components/icons/home";
import CommentIcon from "@/app/components/icons/comment";
import ShareIcon from "./share-icon";
import HolderIcon from "./holder-icon";
import TokenIcon from "@/app/components/avatar/token";
import TxIcon from "./tx-icon";
import RocketIcon from "./rocket-icon";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";
import Timer from "./timer";

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
      className={`${styles.Actions} ${
        isMobile ? styles.MbActions : styles.PcActions
      }`}
      style={{
        opacity: disabled ? 0.3 : 1
      }}
    >
      <TokenIcon
        token={token}
        onClick={() => {
          onClick("detail");
        }}
      />
      {token.status === 0 && <Timer time={token.created_at} />}
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
              await actionLikeTrigger(token, showShare);
              onSuccess("like");
            }}
            id={isCurrent ? "guid-tour-like" : ""}
          />

          <div
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
                size={22}
                type={token.isSuperLike ? "primary" : "normal"}
              />
            </button>
            <span>{token.prePaid}</span>
          </div>
        </>
      ) : (
        <>
          <div
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
              <RocketIcon isActive={false} />
            </button>
            <span>{0}</span>
          </div>
          <div
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
              <HolderIcon />
            </button>
            <span>{totalHolders}</span>
          </div>
          <div
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
              <TxIcon />
            </button>
            <span>{0}</span>
          </div>
        </>
      )}
      {token.status === 0 && (
        <div
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
            <CommentIcon size={26} />
          </button>
          <span>{token.comment || 0}</span>
        </div>
      )}
      <div
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
          <ShareIcon size={24} />
        </button>
        <span>
          {numberFormatter(token.share_num, 1, true, {
            isShort: true,
            isShortUppercase: true
          }) || 0}
        </span>
      </div>
    </div>
  );
}
