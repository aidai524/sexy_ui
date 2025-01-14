import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "../loading";
import TourGuid from "../tour-guid";
import useData from "@/app/sections/home/hooks/use-data-mobile";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";

let startY = 0;
let startX = 0;
let started = false;
export default function List({ type, isCurrentTab, onChangeTab }: any) {
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
  const { innerHeight } = useUserAgent();

  useEffect(() => {
    if (index) {
      if (list.length && index > list.length - 1) {
        onChangeIndex(0);
        setY(0);
      } else {
        setY(-index * innerHeight);
      }
    }

    const prevent = function (e: any) {
      e.preventDefault();
    };
    document.body.addEventListener("touchmove", prevent);
    return () => {
      document.body.removeEventListener("touchmove", prevent);
    };
  }, []);

  return (
    <>
      <div className={styles.Container} style={{ height: innerHeight }}>
        <div
          style={{
            position: "fixed",
            left: type === "preLaunch" ? 0 : "100vw",
            top: 200,
            color: "red",
            zIndex: 100
          }}
        >
          <div>
            {type} Y: {y}
          </div>
          <div>
            {type} Len: {list.length}
          </div>
        </div>
        <div
          className={styles.List}
          style={{
            transform: `translateY(${y}px)`
          }}
          onTouchStart={(ev: any) => {
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
                if (currentIndex < list.length - 1) currentIndex++;
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

            if (Math.abs(i - index) < 2 && item) {
              token = getProjectById(type, item);
            }
            return (
              <Token
                key={item}
                token={token}
                isCurrent={index === i && isCurrentTab}
                onUpdate={(token: any) => {
                  updateProject(type, token);
                }}
              />
            );
          })}
        </div>

        {!list?.length && !isLoading && (
          <div className={styles.Wrapper}>
            <Empty height={innerHeight} text="No more projects" />
          </div>
        )}
        {isLoading && (
          <div className={styles.Wrapper} style={{ height: innerHeight }}>
            <Loading />
          </div>
        )}
      </div>
      {type === "preLaunch" && !!list?.length && <TourGuid />}{" "}
    </>
  );
}
