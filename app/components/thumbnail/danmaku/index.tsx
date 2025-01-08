import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import useCommentList from "@/app/hooks/use-comment-list";

export default function DanmakuComp({ data }: any) {
  const timeRef = useRef<any>();
  const eleRef = useRef<any>();
  const { loadMoreComment, commentList } = useCommentList({ id: data?.id });

  const [upperLines, downLines] = useMemo(() => {
    if (!commentList?.length) return [[], []];
    const _u: any = [];
    const _d: any = [];
    let _ustr = 0;
    let _dstr = 0;
    commentList.forEach((comment) => {
      if (_ustr > _dstr) {
        _d.push(comment);
        _dstr += comment.text.length;
      } else {
        _u.push(comment);
        _ustr += comment.text.length;
      }
    });
    return [_u, _d];
  }, [commentList]);

  useEffect(() => {
    const loop = () => {
      clearTimeout(timeRef.current);
      timeRef.current = setTimeout(async () => {
        await loadMoreComment(0);
        loop();
      }, 5000);
    };
    loop();

    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{
        x: 400
      }}
      animate={{
        x: 0
      }}
      transition={{
        duration: 10,
        ease: "linear",
        delay: 1
      }}
      className={styles.Container}
      ref={eleRef}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          delay: 11
        }}
        className={styles.List}
      >
        {[...upperLines, ...upperLines].map((comment: any) => (
          <div key={comment.id} className={styles.Comment}>
            {comment.creater?.icon && (
              <img src={comment.creater.icon} className={styles.CommentIcon} />
            )}
            <div className={styles.CommentText}>{comment.text}</div>
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          delay: 11
        }}
        className={styles.List}
      >
        {[...downLines, ...downLines].map((comment: any) => (
          <div key={comment.id} className={styles.Comment}>
            {comment.creater?.icon && (
              <img src={comment.creater.icon} className={styles.CommentIcon} />
            )}
            <div className={styles.CommentText}>{comment.text}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
