import styles from "./index.module.css";

export default function Carousel() {
  return (
    <div className={styles.CarouselContainer}>
      <div className={styles.Carousel}>
        <div className={styles.CarouselInner}>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
          <div className={styles.CarouselItem}>KING OF THE HILL</div>
        </div>
      </div>
    </div>
  );
}
