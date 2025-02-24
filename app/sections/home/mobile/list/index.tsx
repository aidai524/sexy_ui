import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "../loading";
import useData from "@/app/sections/home/hooks/use-data";
import { useEffect, useState, useRef, useMemo } from "react";
import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import { useHomeTab } from "@/app/store/useHomeTab";

let startY = 0;
let startX = 0;
let started = false;
export default function List({
  type,
  tabIndex,
  isCurrentTab,
  onChangeTab
}: any) {
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

  const contentHeight = innerHeight - 72;
  // const guidingTourStore = useGuidingTour();
  const listRef = useRef<any>();

  const currentToken = useMemo(() => {
    const id = list[index];
    if (!id) return null;
    return getProjectById(id);
  }, [index, list]);

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
      setY(-index * contentHeight);
    }
  }, [index, list]);

  useEffect(() => {
    if (hasNext || type !== "forYou") return;
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
          height: contentHeight,
          width: innerWidth,
          left: tabIndex * innerWidth
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
            {type} Id: {currentToken?.id}
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
            // if (!guidingTourStore.hasShownTour) return;
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
              onChangeTab(tabIndex + (diffX < 0 ? 1 : -1));
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

              diffY = -contentHeight * currentIndex;
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

            if (Math.abs(i - index) < 20 && item) {
              token = getProjectById(item);
            }

            return (
              <Token
                key={item}
                token={token}
                isCurrent={index === i && isCurrentTab}
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
                dataAvailable={Math.abs(i - index) < 5 && isCurrentTab}
              />
            );
          })}
          {!isLoading && (
            <div
              className={styles.EmptyWrapper}
              style={{ height: contentHeight }}
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
        </div>

        {isLoading && (
          <div
            className={styles.Wrapper}
            style={{ height: contentHeight, width: innerWidth }}
          >
            <Loading />
          </div>
        )}
      </div>
      {/* {type === "forYou" &&
        !!list?.length &&
        !guidingTourStore.hasShownTour && <TourGuid />} */}
    </>
  );
}
