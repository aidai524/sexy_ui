import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "../loading";
import TourGuid from "../tour-guid";
import useData from "@/app/sections/home/hooks/use-data-mobile";
import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
import { useHomeTab } from "@/app/store/useHomeTab";

let startY = 0;
let startX = 0;
let started = false;
export default function List({ type, isCurrentTab, onChangeTab }: any) {
  const {
    getIndex,
    isLoading,
    list,
    hasNext,
    onChangeIndex,
    updateProject,
    getProjectById,
    queryAndUpdateDetail
  } = useData(type);
  const index = getIndex(type);
  const [y, setY] = useState(0);
  const homeTabStore: any = useHomeTab();
  const { innerHeight, innerWidth } = useUserAgent();
  const guidingTourStore = useGuidingTour();
  const listRef = useRef<any>();

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

  useEffect(() => {
    if (hasNext || type === "preLaunch") return;
    if (!listRef.current) return;
    listRef.current.style.transition = "none";
    onChangeIndex(0);
    setY(0);
    setTimeout(() => {
      listRef.current.style.transition = "0.3s";
    }, 60);
  }, [hasNext, type]);

  return (
    <>
      <div
        className={styles.Container}
        style={{
          height: innerHeight,
          width: innerWidth,
          left: type === "preLaunch" ? 0 : innerWidth
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 200,
            color: "red",
            zIndex: 100
          }}
        >
          <div>
            {type} Index: {index}
          </div>
          <div>
            {type} Len: {list.length}
          </div>
        </div>
        <div
          className={styles.List}
          ref={listRef}
          style={{
            transform: `translateY(${y}px)`
          }}
          onTouchStart={(ev: any) => {
            if (!guidingTourStore.hasShownTour) return;
            startY = ev.touches[0].clientY;
            startX = ev.touches[0].clientX;
            started = true;
            ev.stopPropagation();
          }}
          onTouchMove={(ev) => {
            ev.stopPropagation();
            if (!started) return;
            let diffY = ev.touches[0].clientY - startY;
            let diffX = ev.touches[0].clientX - startX;
            if (Math.abs(diffX) > 100) {
              onChangeTab(diffX < 0 ? 1 : 0);
              return;
            }
            if (!list.length) return;
            let currentIndex = index;
            if (Math.abs(diffY) > 100) {
              if (diffY < 0) {
                if (currentIndex < list.length) currentIndex++;
              } else {
                if (currentIndex > 0) currentIndex--;
              }

              diffY = -innerHeight * currentIndex;
              onChangeIndex(currentIndex);
              setY(diffY);
              started = false;
            }
          }}
          onTouchEnd={() => {
            started = false;
          }}
        >
          {list?.map((item: number, i: number) => {
            let token = null;

            if (Math.abs(i - index) < 5 && item) {
              token = getProjectById(type, item);
            }

            return (
              <Token
                key={token?.address || item}
                token={token}
                isCurrent={index === i && isCurrentTab}
                onUpdate={(token: any, action?: string) => {
                  updateProject(type, token);
                  if (action && ["like", "share"].includes(action)) return;
                  if (action === "flip") {
                    setTimeout(() => {
                      queryAndUpdateDetail(type, token.address);
                    }, 2000);
                  }
                  queryAndUpdateDetail(type, token.address);
                }}
              />
            );
          })}
          {!isLoading && (
            <div
              className={styles.EmptyWrapper}
              style={{ height: innerHeight }}
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
        </div>

        {isLoading && (
          <div
            className={styles.Wrapper}
            style={{ height: innerHeight, width: innerWidth }}
          >
            <Loading />
          </div>
        )}
      </div>
      {type === "preLaunch" &&
        !!list?.length &&
        !guidingTourStore.hasShownTour && <TourGuid />}
    </>
  );
}
