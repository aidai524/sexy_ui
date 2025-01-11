import Token from "../token";
import Empty from "@/app/components/empty";
import useData from "@/app/sections/home/hooks/use-data-mobile";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

let startY = 0;
let startX = 0;
let started = false;
export default function List({ type, onChangeTab }: any) {
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

  useEffect(() => {
    if (index) {
      setY(-index * window.innerHeight);
    }
    const prevent = function (e: any) {
      e.preventDefault();
    };
    document.body.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.body.removeEventListener("touchmove", prevent);
    };
  }, []);

  return (
    <div className={styles.Container}>
      <div
        className={styles.List}
        style={{
          transform: `translateY(${y}px)`
        }}
        onTouchStart={(ev: any) => {
          startY = ev.touches[0].clientY;
          startX = ev.touches[0].clientX;
          started = true;
          ev.preventDefault();
        }}
        onTouchMove={(ev) => {
          ev.preventDefault();
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
            diffY = -window.innerHeight * currentIndex;
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
              onUpdate={(token: any) => {
                updateProject(type, token);
              }}
            />
          );
        })}

        {!list?.length && !isLoading && (
          <Empty height="100%" text="No more projects" />
        )}
      </div>
    </div>
  );
}
