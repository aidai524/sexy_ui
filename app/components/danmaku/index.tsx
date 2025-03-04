import { motion, AnimatePresence } from "framer-motion";
import styles from "./index.module.css";
import { ReadAvatar } from "@/app/sections/messages/avatar";
import useDanmaku from "@/app/hooks/use-danmaku";
import LikeIcon from "@/app/sections/home/mobile/actions/like/like-icon";
import RocketIcon from "@/app/sections/home/mobile/actions/rocket-icon";
import { useMemo, useRef, useState, useReducer } from "react";
import { useDebounceFn } from "ahooks";

export default function Danmaku({ id }: any) {
  const [refresher, setRefresher] = useState(0);
  return (
    <DanmakuComp
      id={id}
      key={refresher}
      onRefresher={() => {
        setRefresher(refresher + 1);
      }}
    />
  );
}

function DanmakuComp({ id, onRefresher }: any) {
  const { list, show, hasNext } = useDanmaku({
    id
  });
  const containerRef = useRef<any>();

  const [animationY, duration] = useMemo(() => {
    if (!list.length) return [0, 10];
    const _cy = containerRef.current?.clientHeight || list.length * 36;
    const _y = hasNext ? _cy : _cy + 360;
    const _cd = _y / 360 < 2 ? 10 : (_y / 360) * 5;
    const _d = hasNext ? _cd : _cd + 5;
    return [_y, _d];
  }, [list.length, hasNext]);

  const { run } = useDebounceFn(
    (latest) => {
      if (animationY && Math.abs(Number(latest.y)) + 10 > animationY) {
        onRefresher();
      }
    },
    { wait: 1000 }
  );

  return (
    <div className={styles.Container}>
      <AnimatePresence>
        {show && (
          <motion.div
            key={`danmaku`}
            className={styles.List}
            initial={{ y: 144 }}
            animate={{ y: -animationY }}
            transition={{
              duration,
              ease: "linear"
            }}
            ref={containerRef}
            onUpdate={run}
          >
            {list.map((item: any, i: number) => (
              <div key={item.id + Math.random() + Date.now()}>
                <div className={styles.Comment}>
                  {item?.icon ? (
                    <img src={item.icon} className={styles.CommentIcon} />
                  ) : (
                    <ReadAvatar size={20} />
                  )}
                  {!["launchedLike", "like"].includes(item.type) ? (
                    <div className={styles.CommentText}>{item.text}</div>
                  ) : (
                    <div className={styles.Like}>
                      {item.type === "like" && (
                        <>
                          <span>Liked</span>
                          <LikeIcon isActive={true} size={20} />
                        </>
                      )}
                      {item.type === "launchedLike" && (
                        <>
                          <span>LFG</span>
                          <RocketIcon isActive={true} size={20} />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
