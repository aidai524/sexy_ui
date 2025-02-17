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
import { useHome } from "../context";
import Big from "big.js";

export default function Token({
  isCurrent,
  token,
  danmakus,
  danmakuShow,
  onUpdate
}: any) {
  const [imgHeight, setImgHeight] = useState("80%");
  const { innerHeight } = useUserAgent();
  const descContentRef = useRef<any>();
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const { goDetail } = useHome();

  const { total: totalHolders } = useHolders(token);

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(`${innerHeight - descContentRef.current.clientHeight}px`);
    }
  }, []);

  return (
    <>
      <div className={styles.Container} style={{ height: innerHeight }}>
        <div className={styles.BottomBg} />
        {token?.icon && (
          <div
            className={styles.Bg}
            style={{ backgroundImage: `url(${token.icon})` }}
          />
        )}
        {token?.id && (
          <div className={styles.Content}>
            <Media imgHeight={imgHeight} data={token} />
            <div className={styles.Bottom}>
              {isCurrent && (
                <Danmaku token={token} show={danmakuShow} list={danmakus} />
              )}

              {token.status === 0 ? (
                !token.isSuperLike ? (
                  <Flip
                    token={token}
                    onSuccess={(params: any) => {
                      onUpdate({ ...token, ...params }, "flip");
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
                  isCurrent={isCurrent}
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
                  return;
                }
                if (type === "detail") {
                  goDetail(token);
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
              totalHolders={totalHolders}
              onSuccess={(type: string) => {
                if (type === "like") {
                  token.isLike = true;
                  token.like = token.like + 1;
                }
                if (type === "share") {
                  // token.share_num = token.share_num + 1;
                }
                onUpdate(token, type);
              }}
              isCurrent={isCurrent}
            />
          </div>
        )}
      </div>
      {showFlipModal && (
        <SmokePanel
          token={token}
          show={showFlipModal}
          onSuccess={(amount: string) => {
            token.isSuperLike = true;
            token.prePaid = token.prePaid + 1;
            token.total_amount = Number(token.total_amount) + Number(amount);
            token.prePaidAmount = Big(token.prePaidAmount || 0)
              .add(Number(amount) * 1e9)
              .toString();
            token.isLike = true;
            token.like = token.like + 1;
            onUpdate(token, "flip");
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
