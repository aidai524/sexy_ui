import Multiple from "./component/multiple";
import Statistics from "./component/statistics";
import Rank from "./component/rank";
import styles from "./ming.module.css";

export default function Mining() {
  return (
    <div className={styles.main}>
      <div className={styles.zBox}>
        <Multiple />
        <Statistics />
      </div>
      <Rank />
      <div className={styles.bottomAni}>
        <div className={styles.boxAni} style={{ width: "200vw" }}>
          {[1, 2].map((item) => {
            return (
              <img
                key={item}
                className={styles.boxImg}
                src="/img/mining/bottom-bg.png"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
