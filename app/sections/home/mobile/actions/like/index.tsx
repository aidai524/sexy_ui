import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import LikedLabel from "../liked-label";
import FloatingHearts from "./hearts";
import LikeIcon from "./like-icon";
import { useState } from "react";

export default function Like(props: any) {
  const { like } = props;
  return (
    <div className={styles.Like}>
      <Heart {...props} />
      <div className={styles.LikeNum} id={props.id}>
        {like}
      </div>
    </div>
  );
}

export const Heart = ({ isLiked, onClick = () => {} }: any) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  return (
    <>
      {isLiked && <LikedLabel className={styles.LikedLabel} />}
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
        onClick={() => {
          onClick();
          setShowAnimation(true);
          setShowHearts(true);
          setTimeout(() => {
            setShowAnimation(false);
          }, 1000);
        }}
      >
        <LikeIcon isActive={isLiked} />
      </motion.div>
    </>
  );
};
