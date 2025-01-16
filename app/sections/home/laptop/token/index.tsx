"use client";

import styles from "./index.module.css";
import Media from "@/app/components/thumbnail/media";
import Desc from "@/app/sections/home/mobile/token/desc";
import Actions from "@/app/sections/home/mobile/actions";
import Flip from "@/app/sections/home/mobile/flip";
import Flipped from "@/app/sections/home/mobile/flip/flipped";
import Trade from "@/app/sections/home/mobile/trade";
import Danmaku from "@/app/components/danmaku";
import DetailButton from "./detail-button";
import ScaleButton from "./scale-button";
import TradePanel from "../panels/trade";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useHolders from "@/app/sections/home/mobile/hooks/use-holders";
import { useUserAgent } from "@/app/context/user-agent";
import { useTokenPanelStatus } from "@/app/store/use-token-panel";

export default function Token({ isCurrent, token, onUpdate }: any) {
  const [imgHeight, setImgHeight] = useState("80%");
  const { innerHeight, innerWidth } = useUserAgent();
  const descContentRef = useRef<any>();
  const tokenPanelStatusStore: any = useTokenPanelStatus();

  const { total: totalHolders } = useHolders(token);

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(`${innerHeight - descContentRef.current.clientHeight}px`);
    }
  }, []);

  return (
    <>
      {token?.id && (
        <div className={styles.Box}>
          <div className={styles.Container}>
            <div
              className={styles.Token}
              style={{
                height: innerHeight,
                width: innerWidth
              }}
            >
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
                        tokenPanelStatusStore.setShow("showFlip", true);
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
                      tokenPanelStatusStore.setShow("showTrade", true);
                    }}
                  />
                )}
                <div className={styles.Desc} ref={descContentRef}>
                  <Desc token={token} />
                </div>
              </div>
            </div>
            {token.status !== 0 &&
              isCurrent &&
              tokenPanelStatusStore.showTrade && (
                <TradePanel
                  onClose={() => {
                    tokenPanelStatusStore.setShow("showTrade", false);
                  }}
                  token={token}
                />
              )}
            {token.status !== 0 && !tokenPanelStatusStore.showTrade && (
              <ScaleButton
                onClick={() => {
                  tokenPanelStatusStore.setShow(
                    "showTrade",
                    !tokenPanelStatusStore.showTrade
                  );
                }}
              />
            )}
            <div className={styles.Actions}>
              <DetailButton
                onClick={() => {
                  tokenPanelStatusStore.setShow(
                    "showDetail",
                    !tokenPanelStatusStore.showDetail
                  );
                }}
              />
              <Actions
                token={token}
                onClick={(type: any) => {
                  if (type === "comments") {
                    tokenPanelStatusStore.setShow(
                      "showComments",
                      !tokenPanelStatusStore.showComments
                    );
                    return;
                  }
                  if (!window.sexAddress) {
                    window.connect();
                    return;
                  }
                  if (type === "flip") {
                    tokenPanelStatusStore.setShow(
                      "showFlip",
                      !tokenPanelStatusStore.showFlip
                    );
                  }
                  if (type === "trade") {
                    tokenPanelStatusStore.setTab("holders");
                    tokenPanelStatusStore.setShow(
                      "showTrade",
                      !tokenPanelStatusStore.showTrade
                    );
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
