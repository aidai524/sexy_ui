import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";

export default function Carousel() {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.CarouselContainer}
      style={{
        width: isMobile ? "100%" : 210,
        height: isMobile ? 130 : 60,
        top: isMobile ? "-56px" : "150px"
      }}
    >
      <div
        className={styles.Carousel}
        style={{
          transform: isMobile ? "rotate(-7deg)" : "rotate(-14deg)"
        }}
      >
        <motion.div
          className={styles.CarouselInner}
          animate={{
            x: [0, "25%"]
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 5
          }}
          style={{
            height: isMobile ? 33 : 18,
            fontSize: isMobile ? 20 : 14
          }}
        >
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
        </motion.div>
      </div>
    </div>
  );
}
