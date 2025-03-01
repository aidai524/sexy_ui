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
import LikeToEarn from "../../mobile/token/like-to-earn";
import { useRef } from "react";
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
  isPreview,
  dataAvailable,
  onUpdate,
  onOpenPanel,
  onUpdateTradeTab,
  mediaId,
  showFlip
}: any) {
  const { innerHeight, innerWidth } = useUserAgent();
  const descContentRef = useRef<any>();

  const { total: totalHolders } = useHolders(token);

  return (
    <div
      className={styles.Box}
      style={{
        opacity,
        height: innerHeight,
        width: showTrade && (isCurrent || isNext) ? 1000 : innerWidth
      }}
    >
      {token?.id && (
        <div className={styles.Container}>
          <div
            className={styles.Token}
            style={{
              width: innerWidth,
              height: innerHeight
            }}
          >
            <div className={styles.BottomBg} />
            {token?.icon && (
              <div
                className={styles.Bg}
                style={{ backgroundImage: `url(${token.icon})` }}
              />
            )}
            {token?.status === 0 && !isPreview && <LikeToEarn token={token} />}
            <Media
              imgHeight="100%"
              data={token}
              mediaId={mediaId || token.id}
              videoProgressStyle={
                isCurrent
                  ? { position: "absoulte", left: 16, bottom: 72 }
                  : null
              }
            />
            <div className={styles.Bottom}>
              {isCurrent && <Danmaku id={token.id} />}

              {token.status === 0 ? (
                !token.isSuperLike ? (
                  <Flip
                    token={token}
                    onSuccess={(params: any) => {
                      onUpdate({ ...token, ...params }, "flip");
                    }}
                    onClick={() => {
                      if (isPreview) return;
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
                      onUpdateTradeTab("chart");

                      if (!showTrade) onOpenPanel("showTrade", true);
                    }}
                  />
                )
              )}
              <div className={styles.Desc} ref={descContentRef}>
                <Desc token={token} />
              </div>
            </div>
          </div>
          {showTrade && (isCurrent || isNext) && (
            <TradePanel
              showFlip={showFlip}
              onClose={() => {
                onOpenPanel("showTrade", false);
              }}
              onSuccess={(_token: any, type: string) => {
                onUpdate?.(_token, type);
              }}
              token={token}
              tab={tradeTab}
              setTab={onUpdateTradeTab}
            />
          )}
        </div>
      )}

      {!showTrade && isCurrent && (
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
              onUpdateTradeTab(token.status === 0 ? "details" : "chart");
              onOpenPanel("showTrade", !showTrade);
            }}
          />
        </TipsButton>
      )}

      {dataAvailable && token?.id && (
        <Actions
          isPreview={isPreview}
          disabled={isPreview}
          token={token}
          isPreviewNoOpacity={isPreview}
          onClick={(type: any, params: any) => {
            if (isPreview) {
              return
            }

            let tab = "details";
            if (type === "comments") {
              tab = "comments";
            }

            if (type === "detail") {
              if (params === "Info") tab = "holders";
              if (params === "Trades") tab = "transactions";
            }
            if (type === "flip") {
              tab = "holders";
            }
            onUpdateTradeTab(tab);
            if (!showTrade) onOpenPanel("showTrade");
          }}
          totalHolders={totalHolders}
          onSuccess={(type: string) => {
            if (type === "launched_like") {
              token.is_launched_like = true;
              token.launched_like = token.launched_like + 1;
            }
            onUpdate(token, type);
          }}
          isCurrent={isCurrent}
        />
      )}
    </div>
  );
}
