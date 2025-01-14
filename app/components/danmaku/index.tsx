import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef } from "react";
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
      }, 10000);
    };
    loop();

    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  const data = useMemo(() => {
    if (list.length === 0) return [];
    if (list.length >= 4) return [...list, ...list];
    if (list.length === 3) return [...list, ...list, ...list];
    if (list.length === 2) return [...list, ...list, ...list, ...list];
    if (list.length === 1)
      return [
        ...list,
        ...list,
        ...list,
        ...list,
        ...list,
        ...list,
        ...list,
        ...list
      ];
  }, [list]);

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
          {data?.map((item: any, i: number) => (
            <div key={item.id + Math.random() + Date.now()}>
              <div className={styles.Comment}>
                {item?.icon && (
                  <img src={item.icon} className={styles.CommentIcon} />
                )}
                {item.type !== "like" ? (
                  <div className={styles.CommentText}>{item.text}</div>
                ) : (
                  <div className={styles.Like}>
                    <span>Liked</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                    >
                      <path
                        d="M5.83281 0.981445C3.0537 0.981445 0.800781 3.23438 0.800781 6.01348C0.800781 11.0455 6.74773 15.6201 9.94993 16.6842C13.1521 15.6201 19.0991 11.0455 19.0991 6.01348C19.0991 3.23438 16.8461 0.981445 14.067 0.981445C12.3652 0.981445 10.8606 1.82632 9.94993 3.11951C9.03927 1.82632 7.53469 0.981445 5.83281 0.981445Z"
                        fill="url(#paint0_linear_6057_605)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_6057_605"
                          x1="9.94993"
                          y1="0.981445"
                          x2="9.94993"
                          y2="16.6842"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FF8ABB" />
                          <stop offset="1" stopColor="#FF2681" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
