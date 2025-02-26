import styles from "./index.module.css";
import Like from "./like";
import HomeIcon from "@/app/components/icons/home";
import CommentIcon from "@/app/components/icons/comment";
import ShareIcon from "./share-icon";
import HolderIcon from "./holder-icon";
import TokenIcon from "@/app/components/avatar/token";
import TxIcon from "./tx-icon";
import LaunchesLike from "./launches-like";
import { actionLikeTrigger } from "@/app/components/timesLike/ActionTrigger";
import { useMessage } from "@/app/context/messageContext";
import { useUserAgent } from "@/app/context/user-agent";
import { useAuth } from "@/app/context/auth";
import useHolders from "../hooks/use-holders";
import { numberFormatter } from "@/app/utils/common";
import Timer from "./timer";
import TipsButton from "@/app/sections/home/laptop/tips-button";

export default function Actions({
  token,
  onClick = () => {},
  onSuccess,
  isCurrent,
  disabled,
  isPreview,
  isPreviewNoOpacity
}: any) {
  const { showShare } = useMessage();
  const { isMobile } = useUserAgent();
  const { updateUserLikeNum } = useAuth();
  const { total: totalHolders } = useHolders(token);
  return (
    <div
      className={`${styles.Actions} ${
        isMobile ? styles.MbActions : styles.PcActions
      }`}
      style={{
        opacity: (disabled && !isPreviewNoOpacity) ? 0.3 : 1
      }}
    >
      {isMobile ? (
        <TokenIcon
          token={token}
          onClick={() => {
            onClick("detail");
          }}
        />
      ) : (
        <TipsButton tips="Details">
          <TokenIcon
            token={token}
            onClick={() => {
              onClick("detail");
            }}
          />
        </TipsButton>
      )}
      {token.status === 0 && (
        <Timer time={token.created_at} isPreview={isPreview} />
      )}
      {token.status === 0 ? (
        <>
          <div style={{ height: 14 }} />
          <Like
            {...{
              token,
              onSuccess,
              disabled,
              actionLikeTrigger,
              showShare,
              updateUserLikeNum
            }}
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
            <span>
              {numberFormatter(token.prePaid, 1, true, {
                isShort: true,
                isShortUppercase: true
              }) || 0}
            </span>
          </div>
        </>
      ) : (
        <>
          <LaunchesLike
            className={styles.Item}
            buttonClassName={`${!disabled ? "button" : ""} ${
              !isMobile && styles.PcItem
            }`}
            onClick={async () => {
              await actionLikeTrigger({
                data: token,
                onShare: showShare
              });
              onSuccess("launched_like");
            }}
            isLiked={token.is_launched_like}
            like={token.launched_like}
            disabled={disabled}
            id={token.id}
          />

          <div
            className={styles.Item}
            onClick={() => {
              if (!disabled) onClick("detail", "Info");
            }}
          >
            <button
              className={`${!disabled ? "button" : ""} ${
                !isMobile && styles.PcItem
              }`}
            >
              <HolderIcon />
            </button>
            <span>
              {numberFormatter(totalHolders, 1, true, {
                isShort: true,
                isShortUppercase: true
              }) || 0}
            </span>
          </div>
          <div
            className={styles.Item}
            onClick={() => {
              if (!disabled) onClick("detail", "Trades");
            }}
          >
            <button
              className={`${!disabled ? "button" : ""} ${
                !isMobile && styles.PcItem
              }`}
            >
              <TxIcon />
            </button>
            <span>
              {numberFormatter(token.tx, 1, true, {
                isShort: true,
                isShortUppercase: true
              }) || 0}
            </span>
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
          <span>
            {numberFormatter(token.comment, 1, true, {
              isShort: true,
              isShortUppercase: true
            }) || 0}
          </span>
        </div>
      )}
      <div
        className={styles.Item}
        onClick={() => {
          if (disabled) return;
          if (isPreview) return;
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
