import styles from "./index.module.css";

export default function Bg({ banner }: any) {
  return (
    <div className={styles.Bg}>
      {!banner ? (
        <div className={styles.Flip} />
      ) : (
        <img src={banner} className={styles.Banner} />
      )}
    </div>
  );
}
