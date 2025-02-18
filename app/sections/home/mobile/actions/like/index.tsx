import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import LikedLabel from "../liked-label";
import FloatingHearts from "./hearts";
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="28"
          viewBox="0 0 32 28"
          fill="none"
          className={styles.HeartBg}
        >
          <g filter="url(#filter0_d_8184_79)">
            <path
              d="M4.21564 8.50936C2.40685 15.5166 12.4697 22.8527 16.0071 24C21.9029 21.7052 29.3209 14.4045 27.7986 8.50924C26.0076 1.57316 18.6602 3.9192 16.0071 7.07465C14.2384 4.2059 6.00607 1.57329 4.21564 8.50936Z"
              fill={isLiked ? "#FF2681" : "#fff"}
            />
          </g>
        </svg>
      </motion.div>
    </>
  );
};
