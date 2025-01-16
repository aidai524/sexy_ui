import Token from "../token";
import Empty from "@/app/components/empty";
import Loading from "@/app/sections/home/mobile/loading";
import useData from "@/app/sections/home/hooks/use-data-mobile";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import { useHomeTab } from "@/app/store/useHomeTab";

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
          className={styles.List}
          style={{
            transform: `translateY(${y}px)`
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
    </>
  );
}
