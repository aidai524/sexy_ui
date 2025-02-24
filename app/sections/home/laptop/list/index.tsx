import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "@/app/sections/home/mobile/loading";
import ArrowIcon from "./arrow-icon";
import TipsButton from "../tips-button";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import useData from "@/app/sections/home/hooks/use-data";
import { useEffect, useState, useMemo, useRef } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useTokenPanelStatus } from "@/app/store/use-token-panel";
import Big from "big.js";
import { useDebounceFn } from "ahooks";
import useDanmaku from "@/app/hooks/use-danmaku";

const DetailPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/detail")
);

const CommentsPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/comments")
);

const FlipPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/flip")
);

export default function List({ type, isCurrentTab }: any) {
  const {
    getIndex,
    isLoading,
    list,
    refresher,
    hasNext,
    onChangeIndex,
    updateProject,
    queryAndUpdateDetail,
    getProjectById
  } = useData(type);
  const index = getIndex(type);
  const [y, setY] = useState(0);
  const homeTabStore: any = useHomeTab();
  const tokenPanelStatusStore: any = useTokenPanelStatus();
  const { innerHeight, innerWidth } = useUserAgent();
  const listRef = useRef<any>();
  const containerRef = useRef<any>();
  const startY = useRef<number>(0);

  useEffect(() => {
    if (list.length && index > list.length) {
      onChangeIndex(0);
      setY(0);
    } else {
      setY(-index * (innerHeight + 16));
    }
  }, [index, list]);

  useEffect(() => {
    if (hasNext || type === "preLaunch") return;
    if (!listRef.current) return;
    listRef.current.style.transition = "none";
    onChangeIndex(0);
    setY(0);
    setTimeout(() => {
      listRef.current.style.transition = "0.3s";
    }, 60);
  }, [hasNext]);

  const currentToken = useMemo(() => {
    const id = list[index];
    if (!id) return null;
    return getProjectById(id);
  }, [index, list, refresher]);

  const { list: danmakus, show: danmakuShow } = useDanmaku({
    id: currentToken?.id,
    isCurrentTab
  });

  const { run } = useDebounceFn(
    (ev: any) => {
      const diff = ev.deltaY - startY.current;
      startY.current = 0;

      if (Math.abs(diff) < 100) return;

      if (diff < 0 && index < list.length) {
        onChangeIndex(index + 1);
        return;
      }
      if (diff > 0 && index > 0) onChangeIndex(index - 1);
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const wheel = (ev: any) => {
      if (tokenPanelStatusStore.hasShow(type)) return;
      if (startY.current === 0) {
        startY.current = ev.deltaY;
        return;
      }
      run(ev);
    };
    containerRef.current.addEventListener("wheel", wheel);

    return () => {
      containerRef.current?.removeEventListener("wheel", wheel);
    };
  }, []);

  return (
    <div
      id={`${type}-list`}
      ref={containerRef}
      className={styles.Container}
      style={{
        height: innerHeight,
        zIndex: isCurrentTab ? 10 : 0,
        opacity: isCurrentTab ? 1 : 0
      }}
    >
      <div
        className={styles.List}
        ref={listRef}
        style={{
          transform: `translate(${
            tokenPanelStatusStore.hasShow(type)
              ? "calc(50vw - 600px)"
              : "calc(50vw - 300px)"
          }, ${y}px)`,
          width: innerWidth
        }}
      >
        {list?.map((item: number, i: number) => {
          let token = null;

          if (Math.abs(i - index) < 20 && item) {
            token = getProjectById(item);
          }

          return (
            <Token
              key={token?.address || item}
              token={token}
              isCurrent={index === i && isCurrentTab}
              isNext={i - 1 === index && type === "launching"}
              danmakus={danmakus}
              danmakuShow={danmakuShow}
              onUpdate={(token: any, action?: string) => {
                if (action && ["launched_like"].includes(action)) {
                  updateProject(token);
                  return;
                }
                if (action === "flip") {
                  setTimeout(() => {
                    queryAndUpdateDetail(token.address);
                  }, 4000);
                  return;
                }
                queryAndUpdateDetail(token.address);
              }}
              opacity={index > i ? 0 : 1}
              showTrade={tokenPanelStatusStore.showTrade}
              tradeTab={tokenPanelStatusStore.tab}
              onUpdateTradeTab={tokenPanelStatusStore.setTab}
              onOpenPanel={(panleType: string) => {
                tokenPanelStatusStore.setShow(
                  panleType,
                  !tokenPanelStatusStore[panleType]
                );
              }}
              dataAvailable={Math.abs(i - index) < 5 && isCurrentTab}
            />
          );
        })}

        {!isLoading && (
          <div
            className={styles.EmptyWrapper}
            style={{ height: innerHeight, width: innerWidth }}
          >
            <Empty height={300} text="No more projects" />
            {type !== "forYou" && (
              <button
                className={styles.Button}
                onClick={() => {
                  homeTabStore.set({
                    homeTabIndex: 0
                  });
                }}
              >
                View For You
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div
            className={styles.Wrapper}
            style={{ height: innerHeight, width: innerWidth }}
          >
            <Loading />
          </div>
        )}
      </div>
      {!!list?.length && (
        <div className={styles.ArrowButtons}>
          <TipsButton tips="Previous">
            <ArrowIcon
              disabled={index === 0}
              onClick={() => {
                if (index === 0) return;
                onChangeIndex(index - 1);
              }}
            />
          </TipsButton>
          <TipsButton tips="Next">
            <ArrowIcon
              disabled={index === list.length}
              isDown={true}
              onClick={() => {
                if (index === list.length) return;
                onChangeIndex(index + 1);
              }}
            />
          </TipsButton>
        </div>
      )}
      {currentToken && (
        <AnimatePresence mode="wait">
          {tokenPanelStatusStore.showDetail && (
            <DetailPanel
              token={currentToken}
              onClose={() => {
                tokenPanelStatusStore.setShow("showDetail", false);
              }}
            />
          )}
          {tokenPanelStatusStore.showComments && (
            <CommentsPanel
              token={currentToken}
              onClose={() => {
                tokenPanelStatusStore.setShow("showComments", false);
              }}
              onSuccess={() => {
                currentToken.comment = currentToken.comment + 1;
                updateProject(currentToken);
                queryAndUpdateDetail(currentToken.address);
              }}
            />
          )}
          {tokenPanelStatusStore.showFlip && type === "preLaunch" && (
            <FlipPanel
              token={currentToken}
              onClose={() => {
                tokenPanelStatusStore.setShow("showFlip", false);
              }}
              onSuccess={(amount: string) => {
                currentToken.isSuperLike = true;
                currentToken.prePaid = currentToken.prePaid + 1;
                currentToken.total_amount =
                  Number(currentToken.total_amount) + Number(amount);
                currentToken.prePaidAmount = Big(
                  currentToken.prePaidAmount || 0
                )
                  .add(Number(amount) * 1e9)
                  .toString();
                updateProject(currentToken);
                tokenPanelStatusStore.setShow("showFlip", false);
                setTimeout(() => {
                  queryAndUpdateDetail(currentToken.address);
                }, 2000);
              }}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
