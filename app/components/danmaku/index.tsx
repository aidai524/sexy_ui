import { motion } from "framer-motion";
import styles from "./index.module.css";
import { ReadAvatar } from "@/app/sections/messages/avatar";
import useDanmaku from "@/app/hooks/use-danmaku";
import LikeIcon from "@/app/sections/home/mobile/actions/like/like-icon";
import RocketIcon from "@/app/sections/home/mobile/actions/rocket-icon";

export default function DanmakuComp({ id }: any) {
  const { list, show } = useDanmaku({
    id
  });
  return (
    <div className={styles.Container}>
      {show && !!list.length && (
        <motion.div
          className={styles.List}
          initial={{ y: 144 }}
          animate={{ y: "-100%" }}
          transition={{
            duration: list.length * 1 + (list.length <= 10 ? 5 : -2),
            ease: "linear"
          }}
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
