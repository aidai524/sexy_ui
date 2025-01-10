import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useEffect, useRef } from "react";
import useDanmaku from "@/app/hooks/use-danmaku";

export default function DanmakuComp({ token }: any) {
  const timeRef = useRef<any>();
  const { loadMore, list } = useDanmaku({ id: token?.id });

  useEffect(() => {
    const loop = () => {
      clearTimeout(timeRef.current);
      timeRef.current = setTimeout(async () => {
        await loadMore(0);
        loop();
      }, 5000);
    };
    loop();

    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  return (
    <div className={styles.Container}>
      <motion.div
        initial={{
          y: 144
        }}
        animate={{
          y: 0
        }}
        transition={{
          duration: 8,
          ease: "linear",
          delay: 2
        }}
      >
        <motion.div
          className={styles.List}
          initial={{ y: 0 }}
          animate={{ y: "-50%" }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
            delay: 10
          }}
        >
          {[...list, ...list]?.map((item: any, i: number) => (
            <div key={item.id + Math.random() + Date.now()}>
              <div className={styles.Comment}>
                {item.account_data?.icon && (
                  <img
                    src={item.account_data.icon}
                    className={styles.CommentIcon}
                  />
                )}
                <div className={styles.CommentText}>{item.text}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
