import { motion } from "framer-motion";
import styles from "./index.module.css";
import { ReadAvatar } from "@/app/sections/messages/avatar";

export default function DanmakuComp({ list, show }: any) {
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
      )}
    </div>
  );
}
