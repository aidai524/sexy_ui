import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import LikedLabel from "../liked-label";
import FloatingHearts from "./hearts";
import LikeIcon from "./like-icon";
import { useEffect, useState } from "react";

export default function Like({
  token,
  onSuccess,
  disabled,
  actionLikeTrigger,
  showShare,
  updateUserLikeNum
}: any) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [mergedLiked, setMergedLiked] = useState(false);
  const [mergedNum, setMergedNum] = useState(0);

  useEffect(() => {
    setMergedLiked(token.isLike);
    setMergedNum(token.like);
  }, [token]);

  return (
    <div
      className={styles.Like}
      onClick={async () => {
        if (mergedLiked || disabled) return;
        if (!window.sexAddress) {
          window.connect();
          return;
        }

        setShowAnimation(true);
        setShowHearts(true);
        setTimeout(() => {
          setShowAnimation(false);
        }, 1000);

        setTimeout(() => {
          setShowHearts(false);
        }, 6000);

        const res = await actionLikeTrigger({
          data: token,
          onShare: showShare,
          onSuccess: updateUserLikeNum
        });

        if (res) {
          setMergedLiked(true);
          setMergedNum(mergedNum + 1);
          onSuccess("like");
        }
      }}
    >
      {mergedLiked && <LikedLabel className={styles.LikedLabel} />}
      {showHearts && <FloatingHearts />}
      <Image
        src="/img/home/liked.gif"
        width={124}
        height={124}
        alt="Liked"
        className={styles.HeartGif}
        style={{
          left: -45,
          bottom: -30,
          opacity: showAnimation ? 1 : 0
        }}
      />
      <motion.div
        initial={{ opacity: showAnimation ? 1 : 0 }}
        animate={{ opacity: showAnimation ? 0 : 1 }}
        className={`${styles.Heart} button`}
      >
        <LikeIcon isActive={mergedLiked} />
      </motion.div>
      <div className={styles.LikeNum}>{mergedNum}</div>
    </div>
  );
}
