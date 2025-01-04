import { motion } from "framer-motion";
import styles from "./index.module.css";

export default function Carousel() {
  return (
    <div className={styles.CarouselContainer}>
      <div className={styles.Carousel}>
        <motion.div
          className={styles.CarouselInner}
          animate={{
            x: ['25%', 0],
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 5,
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
