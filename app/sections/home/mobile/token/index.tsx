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

export default function Token({ isCurrent, token, onUpdate }: any) {
  const [imgHeight, setImgHeight] = useState("80%");

  const descContentRef = useRef<any>();
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const { total: totalHolders } = useHolders(token);

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(
        `${window.innerHeight - descContentRef.current.clientHeight}px`
      );
    }
  }, []);

  return (
    <>
      <div className={styles.Container} style={{ height: window.innerHeight }}>
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
                    onSuccess={() => {
                      token.prePaid = (token.prePaid || 0) + 1;
                      onUpdate(token);
                    }}
                    onClick={() => {
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
                if (type === "flip") {
                  setShowFlipModal(true);
                }
                if (type === "comments") {
                  setShowCommentsModal(true);
                }
              }}
              totalHolders={totalHolders}
              onSuccess={(type: string) => {
                if (type === "like") {
                  token.isLike = true;
                  token.like = token.like + 1;
                }
                // token.prePaid = (token.prePaid || 0) + 1;
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
          onSuccess={() => {
            token.prePaid = token.prePaid + 1;
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
            // TODO:
            // token.isLike = true;
            //       token.like = token.like + 1;
            //       onUpdate(token);
          }}
        />
      )}
    </>
  );
}
