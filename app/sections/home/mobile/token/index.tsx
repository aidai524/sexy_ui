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
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useHolders from "../hooks/use-holders";
import { useUserAgent } from "@/app/context/user-agent";

export default function Token({ isCurrent, token, onUpdate }: any) {
  const [imgHeight, setImgHeight] = useState("80%");
  const { innerHeight } = useUserAgent();
  const descContentRef = useRef<any>();
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const { total: totalHolders } = useHolders(token);

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(`${innerHeight - descContentRef.current.clientHeight}px`);
    }
  }, []);

  return (
    <>
      <div className={styles.Container} style={{ height: innerHeight }}>
        {token?.id && (
          <>
            <Media imgHeight={imgHeight} data={token} />
            <div className={styles.Labels}>
              {token.isSuperLike && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.FlippedLabel}
                  src="/img/home/flipped.png"
                />
              )}
              {token.isLike && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.LikedLabel}
                  src="/img/home/liked.png"
                />
              )}
            </div>
            <div className={styles.Bottom}>
              {isCurrent && <Danmaku token={token} />}

              {token.status === 0 ? (
                !token.isSuperLike ? (
                  <Flip
                    token={token}
                    onSuccess={(params: any) => {
                      onUpdate({ ...token, ...params });
                    }}
                    onClick={() => {
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
                <Trade
                  token={token}
                  totalHolders={totalHolders}
                  onClick={() => {
                    if (!window.sexAddress) {
                      window.connect();
                      return;
                    }
                    setShowTradeModal(true);
                  }}
                />
              )}
              <div className={styles.Desc} ref={descContentRef}>
                <Desc token={token} />
              </div>
            </div>
            <Actions
              token={token}
              onClick={(type: any) => {
                if (type === "comments") {
                  setShowCommentsModal(true);
                }
                if (!window.sexAddress) {
                  window.connect();
                  return;
                }
                if (type === "flip") {
                  setShowFlipModal(true);
                }
              }}
              totalHolders={totalHolders}
              onSuccess={(type: string) => {
                if (type === "like") {
                  token.isLike = true;
                  token.like = token.like + 1;
                }
                onUpdate(token);
              }}
              isCurrent={isCurrent}
            />
          </>
        )}
      </div>
      {showFlipModal && (
        <SmokePanel
          token={token}
          show={showFlipModal}
          onSuccess={(amount: string) => {
            token.isSuperLike = true;
            token.prePaid = token.prePaid + 1;
            token.total_amount = amount;
            onUpdate(token);
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
            onUpdate(token);
          }}
          total={token.comment}
        />
      )}
    </>
  );
}
