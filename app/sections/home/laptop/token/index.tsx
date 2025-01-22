"use client";

import styles from "./index.module.css";
import Media from "@/app/components/thumbnail/media";
import Desc from "@/app/sections/home/mobile/token/desc";
import Actions from "@/app/sections/home/mobile/actions";
import Flip from "@/app/sections/home/mobile/flip";
import Flipped from "@/app/sections/home/mobile/flip/flipped";
import Trade from "@/app/sections/home/mobile/trade";
import Danmaku from "@/app/components/danmaku";
import ScaleButton from "./scale-button";
import TradePanel from "../panels/trade";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useHolders from "@/app/sections/home/mobile/hooks/use-holders";
import { useUserAgent } from "@/app/context/user-agent";
import TipsButton from "@/app/sections/home/laptop/tips-button";

export default function Token({
  isCurrent,
  isNext,
  token,
  opacity,
  showTrade,
  tradeTab,
  onUpdate,
  onOpenPanel,
  onUpdateTradeTab
}: any) {
  const [imgHeight, setImgHeight] = useState("80%");
  const { innerHeight, innerWidth } = useUserAgent();
  const descContentRef = useRef<any>();

  const { total: totalHolders } = useHolders(token);

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(`${innerHeight - descContentRef.current.clientHeight}px`);
    }
  }, []);

  return (
    <div
      className={styles.Box}
      style={{
        opacity,
        height: innerHeight,
        width: showTrade && isNext ? 968 : innerWidth
      }}
    >
      {token?.id && (
        <div className={styles.Container}>
          <div
            className={styles.Token}
            style={{
              width: showTrade && isNext ? 968 : innerWidth,
              height: innerHeight
            }}
          >
            <Media imgHeight={imgHeight} data={token} />
            <div
              className={styles.Labels}
              style={{
                right: showTrade ? 70 : 0
              }}
            >
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
                      onUpdate({ ...token, ...params }, "flip");
                    }}
                    onClick={() => {
                      if (!window.sexAddress) {
                        window.connect();
                        return;
                      }
                      onOpenPanel("showFlip", true);
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
                    onUpdateTradeTab("chart");

                    if (!showTrade) onOpenPanel("showTrade", true);
                  }}
                />
              )}
              <div className={styles.Desc} ref={descContentRef}>
                <Desc token={token} />
              </div>
            </div>
          </div>
          {token.status !== 0 && isCurrent && showTrade && (
            <TradePanel
              onClose={() => {
                onOpenPanel("showTrade", false);
              }}
              token={token}
              tab={tradeTab}
              setTab={onUpdateTradeTab}
            />
          )}
          {token.status !== 0 && !showTrade && isCurrent && (
            <TipsButton
              tips="Expand"
              triggerStyle={{
                marginBottom: 20,
                position: "absolute",
                top: 0,
                right: -50,
                zIndex: 35
              }}
            >
              <ScaleButton
                onClick={() => {
                  onOpenPanel("showTrade", !showTrade);
                }}
              />
            </TipsButton>
          )}
          <Actions
            token={token}
            onClick={(type: any) => {
              if (type === "comments") {
                onOpenPanel("showComments");
                return;
              }
              if (type === "detail") {
                onOpenPanel("showDetail");
                return;
              }
              if (!window.sexAddress) {
                window.connect();
                return;
              }
              if (type === "flip") {
                onOpenPanel("showFlip");
              }
              if (type === "trade") {
                onUpdateTradeTab("holders");
                if (!showTrade) onOpenPanel("showTrade");
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
  );
}
