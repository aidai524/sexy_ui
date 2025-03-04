import { motion } from "framer-motion";
import styles from "./index.module.css";
import { ReadAvatar } from "@/app/sections/messages/avatar";
import useDanmaku from "@/app/hooks/use-danmaku";
import LikeIcon from "@/app/sections/home/mobile/actions/like/like-icon";
import RocketIcon from "@/app/sections/home/mobile/actions/rocket-icon";
import { useMemo, useRef } from "react";

export default function DanmakuComp({ id }: any) {
  const { list, show } = useDanmaku({
    id
  });
  const containerRef = useRef<any>();

  const [animationY, duration] = useMemo(() => {
    if (!list.length) return [0, 10];
    const _y = containerRef.current?.clientHeight || list.length * 36;
    const _d = _y / 360 < 2 ? 10 : (_y / 360) * 5;
    return [_y, _d];
  }, [list.length]);

  return (
    <div className={styles.Container}>
      {show && !!list.length && (
        <motion.div
          className={styles.List}
          initial={{ y: 144 }}
          animate={{ y: -animationY }}
          transition={{
            duration,
            ease: "linear"
          }}
          ref={containerRef}
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
    </div>
  );
}
