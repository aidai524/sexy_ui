"use client";

import styles from "./index.module.css";
import Media from "@/app/components/thumbnail/media";
import Desc from "./desc";
import Actions from "../actions";
import Flip from "../flip";
import Flipped from "../flip/flipped";
import Trade from "../trade";
import SmokePanel from "@/app/components/smokHot/smoke-panel";
import Danmaku from "@/app/components/danmaku";
import TradeModal from "@/app/components/trade-modal";
import CommentsModal from "../comments";
import LikeToEarn from "./like-to-earn";
import { useState, useRef } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useHome } from "../context";

export default function Token({
  isCurrent,
  onUpdate,
  isPreview = false,
  isPreviewNoOpacity = false,
  token,
  dataAvailable,
  style = {},
  mediaId
}: any) {
  const { innerHeight } = useUserAgent();
  const descContentRef = useRef<any>();
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const { goDetail } = useHome();

  return (
    <>
      <div
        className={styles.Container}
        style={{
          height: isPreview ? innerHeight - 60 : innerHeight - 72,
          ...style
        }}
      >
        <div className={styles.BottomBg} />
        {token?.icon && (
          <div
            className={styles.Bg}
            style={{ backgroundImage: `url(${token.icon})` }}
          />
        )}
        {token?.id && (
          <div className={styles.Content}>
            {token.status === 0 && !isPreview && <LikeToEarn token={token} />}
            <Media
              imgHeight="100%"
              data={token}
              mediaId={mediaId || token.id}
              videoProgressStyle={
                isCurrent ? { position: "fixed", left: 16, bottom: 72 } : null
              }
            />
            <div className={styles.Bottom}>
              {isCurrent && <Danmaku id={token.id} />}

              {token.status === 0 ? (
                !token.isSuperLike ? (
                  <Flip
                    token={token}
                    onSuccess={(params: any) => {
                      onUpdate?.({ ...token, ...params }, "flip");
                    }}
                    onClick={() => {
                      if (isPreview) return;
                      if (!window.sexAddress) {
                        window.connect();
                        return;
                      }
                      setShowFlipModal(true);
                    }}
                    id={isCurrent ? "guid-tour-flip" : token.id}
                  />
                ) : (
                  <Flipped token={token} />
                )
              ) : (
                dataAvailable && (
                  <Trade
                    token={token}
                    isCurrent={isCurrent}
                    onClick={() => {
                      if (isPreview) return;
                      if (!window.sexAddress) {
                        window.connect();
                        return;
                      }

                      setShowTradeModal(true);
                    }}
                  />
                )
              )}
              <div className={styles.Desc} ref={descContentRef}>
                <Desc token={token} />
              </div>
            </div>
            {dataAvailable && (
              <Actions
                token={token}
                onClick={(type: any, params: any) => {
                  if (type === "detail") {
                    goDetail(token, params);
                    return;
                  }

                  if (isPreview) return;
                  if (type === "comments") {
                    setShowCommentsModal(true);
                    return;
                  }

                  if (!window.sexAddress) {
                    window.connect();
                    return;
                  }
                  if (type === "flip") {
                    setShowFlipModal(true);
                  }
                  if (type === "trade") {
                    setShowTradeModal(true);
                  }
                }}
                onSuccess={(type: string) => {
                  if (type === "launched_like") {
                    token.is_launched_like = true;
                    token.launched_like = token.launched_like + 1;
                  }
                  onUpdate?.(token, type);
                }}
                isCurrent={isCurrent}
                isPreview={isPreview}
                isPreviewNoOpacity={isPreviewNoOpacity}
                disabled={isPreview}
              />
            )}
          </div>
        )}
      </div>
      {!isPreview && token && (
        <>
          {showFlipModal && (
            <SmokePanel
              token={token}
              show={showFlipModal}
              onSuccess={(amount: string) => {
                onUpdate?.(token, "flip");
                setShowFlipModal(false);
              }}
              onHide={() => {
                setShowFlipModal(false);
              }}
            />
          )}
          {showTradeModal && (
            <TradeModal
              show={showTradeModal}
              onClose={() => {
                setShowTradeModal(false);
              }}
              onSuccess={() => {
                onUpdate?.(token, "trade");
                setShowTradeModal(false);
              }}
              data={token}
            />
          )}
          {showCommentsModal && (
            <CommentsModal
              show={showCommentsModal}
              onClose={() => {
                setShowCommentsModal(false);
              }}
              id={token.id}
              onSuccess={() => {
                token.comment = token.comment + 1;
                onUpdate?.(token);
              }}
              total={token.comment}
            />
          )}
        </>
      )}
    </>
  );
}
