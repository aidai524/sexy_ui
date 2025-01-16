import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "@/app/sections/home/mobile/loading";
import ArrowIcon from "./arrow-icon";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import useData from "@/app/sections/home/hooks/use-data-mobile";
import { useEffect, useState, useMemo } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useTokenPanelStatus } from "@/app/store/use-token-panel";

const DetailPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/detail"),
  {
    ssr: false
  }
);

const CommentsPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/comments"),
  {
    ssr: false
  }
);

export default function List({ type, isCurrentTab }: any) {
  const {
    getIndex,
    hasNext,
    isLoading,
    list,
    onChangeIndex,
    updateProject,
    getProjectById
  } = useData(type);
  const index = getIndex(type);
  const [y, setY] = useState(0);
  const homeTabStore: any = useHomeTab();
  const tokenPanelStatusStore: any = useTokenPanelStatus();
  const { innerHeight, innerWidth } = useUserAgent();

  useEffect(() => {
    const prevent = function (e: any) {
      e.preventDefault();
    };
    document.body.addEventListener("touchmove", prevent);
    return () => {
      document.body.removeEventListener("touchmove", prevent);
    };
  }, []);

  useEffect(() => {
    if (list.length && index > list.length) {
      onChangeIndex(0);
      setY(0);
    } else {
      setY(-index * innerHeight);
    }
  }, [index, list]);

  const currentToken = useMemo(() => {
    const id = list[index];
    if (!id) return null;
    return getProjectById(type, id);
  }, [index, list]);

  return (
    <>
      <div
        className={styles.Container}
        style={{
          height: innerHeight
        }}
      >
        <div
          className={styles.List}
          style={{
            transform: `translate(${
              tokenPanelStatusStore.hasShow()
                ? "calc(50vw - 600px)"
                : "calc(50vw - 300px)"
            }, ${y}px)`,
            width: innerWidth
          }}
        >
          {list?.map((item: number, i: number) => {
            let token = null;

            if (Math.abs(i - index) < 2 && item) {
              token = getProjectById(type, item);
            }

            return (
              <Token
                key={token?.address || item}
                token={token}
                isCurrent={index === i && isCurrentTab}
                onUpdate={(token: any) => {
                  updateProject(type, token);
                }}
              />
            );
          })}

          {!isLoading && (
            <div
              className={styles.EmptyWrapper}
              style={{ height: innerHeight, width: innerWidth }}
            >
              <Empty height={300} text="No more projects" />
              <button
                className={styles.Button}
                onClick={() => {
                  homeTabStore.set({
                    homeTabIndex: type === "preLaunch" ? 1 : 0
                  });
                }}
              >
                {type === "preLaunch" ? "View Launches" : "View Pre-Launch"}
              </button>
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
            <ArrowIcon />
            <ArrowIcon isDown={true} />
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
                  updateProject(type, currentToken);
                }}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
